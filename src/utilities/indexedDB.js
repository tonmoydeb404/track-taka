// get indexeddb
const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

export const initDB = ({
  dbname = "",
  version = null,
  stores = [],
  deleteStores = [],
  keyPath = null,
}) => {
  return new Promise((resolve, reject) => {
    // check for browser support
    if (!idb) {
      reject(Error("browser not support IndexedDB"));
    }

    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database upgrade
    databaseReq.onupgradeneeded = async (event) => {
      const db = databaseReq.result;
      const response = {};

      // handle every stores
      stores.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, {
            keyPath,
          });
          response[store] = `created successfull`;
        } else {
          response[store] = `allready created`;
        }
      });

      // handle delete stores
      deleteStores.forEach((store) => {
        if (db.objectStoreNames.contains(store)) {
          db.deleteObjectStore(store);
          response[store] = `deleted successfull`;
        }
      });

      resolve(response);
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      resolve("no new collection to create");
    };
  });
};

export const getCollection = ({
  dbname = "",
  version = null,
  store = null,
}) => {
  return new Promise((resolve, reject) => {
    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      const db = databaseReq.result;

      // check collection contains or not
      if (db.objectStoreNames.contains(store)) {
        // collection transection
        const tx = db.transaction(store, "readonly");
        const txStore = tx.objectStore(store);
        // collection data
        const data = txStore.getAll();

        // handle data success
        data.onsuccess = (event) => {
          // close database on transection complete
          tx.oncomplete = () => db.close();
          resolve(data.result);
        };
        // handle data error
        data.onerror = (event) => {
          reject(Error(event?.target?.error?.toString()));
        };
      } else {
        reject(Error("collection not found"));
      }
    };
  });
};

export const createData = ({
  dbname = "",
  version = null,
  store = null,
  dataObj = null,
}) => {
  return new Promise((resolve, reject) => {
    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      const db = databaseReq.result;
      // collection transection
      const tx = db.transaction(store, "readwrite");
      const txStore = tx.objectStore(store);
      // collection data
      const data = txStore.add(dataObj);

      // handle data success
      data.onsuccess = (event) => {
        // close database on transection complete
        tx.oncomplete = () => db.close();
        resolve(data.result);
      };
      // handle data error
      data.onerror = (event) => {
        reject(Error(event?.target?.error?.toString()));
      };
    };
  });
};

export const updateData = ({
  dbname = "",
  version = null,
  store = null,
  dataObj = null,
}) => {
  return new Promise((resolve, reject) => {
    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      const db = databaseReq.result;
      // collection transection
      const tx = db.transaction(store, "readwrite");
      const txStore = tx.objectStore(store);
      // put to collection data
      const data = txStore.put(dataObj);

      // handle data success
      data.onsuccess = (event) => {
        // close database on transection complete
        tx.oncomplete = () => db.close();
        resolve(data.result);
      };
      // handle data error
      data.onerror = (event) => {
        reject(Error(event?.target?.error?.toString()));
      };
    };
  });
};

export const deleteData = ({
  dbname = "",
  version = null,
  store = null,
  id = null,
}) => {
  return new Promise((resolve, reject) => {
    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      const db = databaseReq.result;
      // collection transection
      const tx = db.transaction(store, "readwrite");
      const txStore = tx.objectStore(store);
      // delete collection from data
      const data = txStore.delete(id);

      // handle data success
      data.onsuccess = (event) => {
        // close database on transection complete
        tx.oncomplete = () => db.close();
        resolve(data.result);
      };
      // handle data error
      data.onerror = (event) => {
        reject(Error(event?.target?.error?.toString()));
      };
    };
  });
};

export const clearData = ({ dbname = "", version = null, store = null }) => {
  return new Promise((resolve, reject) => {
    // open database
    const databaseReq = idb.open(dbname, version);
    // handle database error
    databaseReq.onerror = (event) => {
      reject(Error(event.target?.error?.toString()));
    };
    // handle database success
    databaseReq.onsuccess = (event) => {
      const db = databaseReq.result;
      // collection transection
      const tx = db.transaction(store, "readwrite");
      const txStore = tx.objectStore(store);
      // delete collection from data
      const data = txStore.clear();

      // handle data success
      data.onsuccess = (event) => {
        // close database on transection complete
        tx.oncomplete = () => db.close();
        resolve(data.result);
      };
      // handle data error
      data.onerror = (event) => {
        reject(Error(event?.target?.error?.toString()));
      };
    };
  });
};
