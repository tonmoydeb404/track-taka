import { useGlobal } from "./GlobalContext";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultCategories } from "../../data/siteData";
import {
  createDocument,
  deleteDocument,
  readCollectionRealtime,
  updateDocument,
} from "../../lib/database";
import { useAuth } from "./AuthContext";

// transection context
export const TransectionContext = createContext({
  transections: [],
  categories: [],
});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  // other contexts
  const { monthFilter } = useGlobal();
  const { user } = useAuth();

  // database collection path
  const transectionCollection = useMemo(
    () => ["users", user?.uid, "transections"],
    [user]
  );

  // transection states
  const [transections, setTransections] = useState([]);
  const [categories, setCategories] = useState([]);
  // sorted transection
  const [sortedTx, setSortedTx] = useState([]);

  // TODO: refactor transection actions
  // transection actions
  const txActions = {
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
          createdAt: Date.now(),
        };
        // create data to database
        const response = await createDocument(
          transectionCollection,
          newTransection.id,
          newTransection
        );

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    async update(id, transection = {}) {
      try {
        // update data to database
        const response = await updateDocument(
          transectionCollection,
          id,
          transection
        );

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    async delete(idList = []) {
      try {
        // delete data to database
        const promises = idList.map(
          async (id) => await deleteDocument(transectionCollection, id)
        );
        const response = await Promise.all(promises);

        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },
    async insert() {},
    async clear() {},
  };
  // TODO: refactor category actions
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

  // fetch transections if user is authorized
  useEffect(() => {
    let unsubscribe = () => {};

    if (user && user?.uid) {
      unsubscribe = readCollectionRealtime(["users", user.uid, "transections"])(
        (data) => {
          setTransections(data);
        }
      );
    }
    // clean up
    return () => {
      unsubscribe();
    };
  }, [user]);

  // TODO: refactor update
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

  // TODO: refactor filter
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
