import { useGlobal } from "../GlobalContext";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LOCAL_TRANSECTION_KEY } from "../../../data/constant";
import { defaultCategories } from "../../../data/siteData";
import {
  clearData,
  createData,
  deleteData,
  getCollection,
  initDB,
  updateData,
} from "../../../utilities/indexedDB";
import { DBNAME, DBOLDSTORE, DBSTORE, DBVERSION } from "./constant";

// transection context
export const TransectionContext = createContext({});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  const { monthFilter } = useGlobal();
  // transection states
  const [transections, setTransections] = useState([]);
  const [categories, setCategories] = useState([]);
  // sorted transection
  const [sortedTx, setSortedTx] = useState([]);

  // transection actions
  const txActions = {
    async get() {
      try {
        const response = await getCollection({
          dbname: DBNAME,
          version: DBVERSION,
          store: DBSTORE,
        });

        if (response) {
          setTransections(response);
        }
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    async create(transection = {}) {
      try {
        // new transection
        const newTransection = {
          id: transection.id,
          title: transection.title,
          amount: transection.amount,
          type: transection.type,
          category: transection.category,
          date: transection.date,
          createdAt: new Date().toISOString(),
        };
        // create data to database
        await createData({
          dbname: DBNAME,
          version: DBVERSION,
          store: DBSTORE,
          dataObj: newTransection,
        });

        // update local db
        await txActions.get();
      } catch (error) {
        console.error(error);
      }
    },
    async update(transection = {}) {
      try {
        // update data to database
        await updateData({
          dbname: DBNAME,
          version: DBVERSION,
          store: DBSTORE,
          dataObj: transection,
        });

        // update local db
        await txActions.get();
      } catch (error) {
        console.error(error);
      }
    },
    async delete(idList = []) {
      try {
        // delete data to database
        const promises = idList.map(
          async (id) =>
            await deleteData({
              dbname: DBNAME,
              version: DBVERSION,
              store: DBSTORE,
              id,
            })
        );
        await Promise.all(promises);

        // update local db
        await txActions.get();
      } catch (error) {
        console.error(error);
      }
    },
    async insert(newData = []) {
      const reqProps = ["id", "title", "category", "amount", "type", "date"];

      // filter new transections data
      const filteredData = [...newData].filter((data) => {
        // check required props
        const hasRequiredProps = reqProps.every((prop) =>
          data.hasOwnProperty(prop)
        );
        // check duplicate id
        const isDuplicate = transections.some(
          (prevData) => prevData.id == data.id
        );
        // check data is valid or not
        if (!hasRequiredProps || isDuplicate) return false;

        return true;
      });

      // insert new categories
      // ctActions.insert(filteredData.map((d) => d.category));

      // add data promises
      const promises = filteredData.map(
        async (transection) =>
          await createData({
            dbname: DBNAME,
            version: DBVERSION,
            store: DBSTORE,
            dataObj: transection,
          })
      );
      // resolve all promises
      await Promise.all(promises);
      // update local db
      await txActions.get();
    },
    async clear() {
      // clear store
      await clearData({
        dbname: DBNAME,
        version: DBVERSION,
        store: DBSTORE,
      });

      // update local db
      await txActions.get();
    },
  };
  // category actions
  const ctActions = {
    create(cate = "") {
      // checking for category already exist or not
      if (cate && !categories.includes(cate?.toLowerCase())) {
        setCategories((prevState) => [...prevState, cate?.toLowerCase()]);
      }
    },
    insert(cates = []) {
      // looking for unique category
      let catesState = cates.filter(
        (cate, index, arr) => arr.indexOf(cate) === index
      );
      // check for category already has or not
      catesState = [...catesState].filter((cate) => !categories.includes(cate));

      // update categories
      setCategories([...categories, ...catesState]);
    },
  };

  // initilize app
  useEffect(() => {
    (async () => {
      try {
        // initilize database
        await initDB({
          dbname: DBNAME,
          version: DBVERSION,
          stores: [DBSTORE],
          deleteStores: [DBOLDSTORE],
          keyPath: "id",
        });
        // fetch data
        const response = await txActions.get();

        // migrate with localstorage data
        if (!response || !response.length) {
          const localData = localStorage.getItem(LOCAL_TRANSECTION_KEY);
          // validate localstorage data
          if (localData != null && localData) {
            // parse data
            const parseLocalData = JSON.parse(localData) || [];
            // validate parsed data
            if (parseLocalData && parseLocalData.length) {
              // insert this data to state
              const promise = txActions.insert(parseLocalData);
              await toast.promise(promise, {
                loading: "migrating previous data...",
                success: "data migration successfully",
                error: "error: data migration failed",
              });
            }
          }
        } else {
          // clear local storage
          localStorage.removeItem(LOCAL_TRANSECTION_KEY);
        }
      } catch (error) {
        console.error(error);
        toast.error("something wents to wrong");
      }
    })();
  }, []);

  // on transection update
  useEffect(() => {
    // set sort
    const sorted = transections.sort((a, b) => {
      const aCreated = new Date(a.createdAt || Date.now());
      const bCreated = new Date(b.createdAt || Date.now());

      const aDate = new Date(a.date).setHours(
        aCreated.getHours(),
        aCreated.getMinutes(),
        aCreated.getSeconds()
      );

      const bDate = new Date(b.date).setHours(
        bCreated.getHours(),
        bCreated.getMinutes(),
        bCreated.getSeconds()
      );

      return new Date(bDate) - new Date(aDate);
    });
    setSortedTx(sorted);

    // set categories
    ctActions.insert([
      ...defaultCategories,
      ...transections.map((d) => d.category),
    ]);

    return () => {
      setSortedTx([]);
      setCategories([]);
    };
  }, [transections]);

  // filter transection data by month
  const filteredTransections = useMemo(() => {
    return monthFilter.enable && sortedTx
      ? sortedTx.filter((item) => {
          const itemDate = new Date(item.date);
          const selectedDate = new Date(monthFilter.value);

          return (
            itemDate.getMonth() == selectedDate.getMonth() &&
            itemDate.getFullYear() == itemDate.getFullYear()
          );
        })
      : transections;
  }, [sortedTx, monthFilter.enable, monthFilter.value]);

  // context value with memorization
  const value = useMemo(
    () => ({
      transections: transections,
      categories: categories,
      filteredTransections,
      createTransection: txActions.create,
      deleteTransection: txActions.delete,
      updateTransection: txActions.update,
      insertTransection: txActions.insert,
      clearTransection: txActions.clear,
      createCategory: ctActions.create,
      insertCategories: ctActions.insert,
    }),
    [transections, categories, filteredTransections]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};
