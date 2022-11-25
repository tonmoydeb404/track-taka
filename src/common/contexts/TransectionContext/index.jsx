import { useGlobal } from "../GlobalContext";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultCategories } from "../../../data/siteData";
import {
  createData,
  deleteData,
  getCollection,
  initDB,
  updateData,
} from "../../../utilities/indexedDB";
import { DBNAME, DBVERSION } from "./constant";

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

  // TODO: loading state add
  // FIXME: user debounce handle

  // transection actions
  const txActions = {
    async get() {
      try {
        const response = await getCollection({
          dbname: DBNAME,
          version: DBVERSION,
          store: "transections",
        });

        if (response) {
          setTransections(response);
        }
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
          store: "transections",
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
          store: "transections",
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
              store: "transections",
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
            store: "transections",
            dataObj: transection,
          })
      );
      // resolve all promises
      await Promise.all(promises);
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
      // initilize database
      await initDB({
        dbname: DBNAME,
        version: DBVERSION,
        stores: ["transections"],
      });
      // fetch data
      await txActions.get();
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
