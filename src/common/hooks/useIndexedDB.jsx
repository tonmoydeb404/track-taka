import { useEffect, useState } from "react";
import IndexedDB from "../../lib/indexedDB";

const useIndexedDB = (NAME, VERSION, STORE, KEY_PATH, OLD_STORE) => {
  const DB = new IndexedDB(NAME, VERSION, STORE, KEY_PATH, OLD_STORE);

  const [data, setData] = useState(null);

  const wrapper =
    (callback) =>
    (...props) =>
      new Promise(async (resolve, reject) => {
        try {
          const response = await callback(...props);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

  const getData = wrapper(async () => {
    const response = await DB.get();
    setData(response);
    return response;
  });

  const createData = wrapper(async (data) => {
    const response = await DB.create(data);
    // update local db
    await getData();
    return response;
  });
  const insertData = wrapper(async (data = []) => {
    const response = await DB.insert(data);
    // update local db
    await getData();
    return response;
  });
  const updateData = wrapper(async (data) => {
    const response = await DB.update(data);
    // update local db
    await getData();
    return response;
  });
  const deleteData = wrapper(async (id) => {
    // delete data to database
    const response = await DB.delete(id);
    // update local db
    await getData();
    return response;
  });
  const deleteMultipleData = wrapper(async (keyList = []) => {
    // delete data to database
    const promises = keyList.map(async (id) => await DB.delete(id));
    const response = await Promise.all(promises);
    // update local db
    await getData();
    return response;
  });

  const clearData = wrapper(async () => {
    await DB.clear();
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
    createData,
    insertData,
    updateData,
    deleteData,
    deleteMultipleData,
    clearData,
  };
};

export default useIndexedDB;
