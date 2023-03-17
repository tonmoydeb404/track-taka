import { useEffect, useState } from "react";
import config from "../../data/config.json";
import IndexedDB from "../../lib/indexedDB";

const useTransections = () => {
  const DB = new IndexedDB(config.DBNAME, config.DBVERSION);
  // transection state
  const [transections, setTransections] = useState(null);

  const getTransections = async () => {
    try {
      // create data to database
      const response = await DB.getCollection(config.DBSTORE);
      setTransections(response);
      // console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const createTransection = async (transection = {}) => {
    try {
      // new transection
      const newTransection = {
        ...transection,
        createdAt: Date.now(),
      };
      // create data to database
      await DB.create(config.DBSTORE, newTransection);
      // update local db
      await getTransections();

      // console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const updateTransection = async (id, transection = {}) => {
    try {
      // update data to database
      await DB.update(config.DBSTORE, transection);
      // update local db
      await getTransections();
    } catch (error) {
      console.error(error);
    }
  };
  const deleteTransection = async (idList = []) => {
    try {
      // delete data to database
      const promises = idList.map(
        async (id) => await DB.delete(config.DBSTORE, id)
      );
      await Promise.all(promises);
      // update local db
      await getTransections();
    } catch (error) {
      console.error(error);
    }
  };

  // initiate database
  useEffect(() => {
    (async () => {
      try {
        await DB.init(config.DBSTORE, config.DBOLDSTORE);
        await getTransections();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return {
    transections,
    createTransection,
    updateTransection,
    deleteTransection,
  };
};

export default useTransections;
