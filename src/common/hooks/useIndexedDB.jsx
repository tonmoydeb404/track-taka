import { useEffect, useState } from "react";
import IndexedDB from "../../lib/indexedDB";

const useIndexedDB = (NAME, VERSION, STORE, KEY_PATH, OLD_STORE) => {
  const DB = new IndexedDB(NAME, VERSION, STORE, KEY_PATH, OLD_STORE);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const asyncWrapper =
    (callback) =>
    async (...props) => {
      try {
        setError(false);
        setLoading(true);
        await callback(...props);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };

  const getData = asyncWrapper(async () => {
    const response = await DB.getCollection();
    setData(response);
  });

  const createData = asyncWrapper(async (data) => {
    await DB.create(data);
    // update local db
    await getData();
  });
  const updateData = asyncWrapper(async (data) => {
    await DB.update(data);
    // update local db
    await getData();
  });
  const deleteData = asyncWrapper(async (id) => {
    // delete data to database
    await DB.delete(id);
    // update local db
    await getData();
  });
  const deleteMultipleData = asyncWrapper(async (keyList = []) => {
    // delete data to database
    const promises = keyList.map(async (id) => await DB.delete(id));
    await Promise.all(promises);
    // update local db
    await getData();
  });

  // initiate database
  useEffect(() => {
    (async () => {
      try {
        await DB.init();
        await getData();
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return {
    data,
    loading,
    error,
    createData,
    updateData,
    deleteData,
    deleteMultipleData,
  };
};

export default useIndexedDB;
