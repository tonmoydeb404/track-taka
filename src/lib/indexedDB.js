const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

class IndexedDB {
  constructor(DBNAME, VERSION = null) {
    this.DBNAME = DBNAME;
    this.VERSION = VERSION;
  }

  init(STORES = [], DELETE_STORES = [], KEY_PATH = null) {
    return new Promise((resolve, reject) => {
      // check for browser support
      if (!idb) {
        reject(Error("browser does not support IndexedDB"));
      }
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database upgrade
      databaseReq.onupgradeneeded = async (event) => {
        const db = databaseReq.result;
        const response = {};

        // handle every stores
        STORES.forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, {
              keyPath: KEY_PATH,
            });
            response[store] = `created successfull`;
          } else {
            response[store] = `allready created`;
          }
        });

        // handle delete stores
        DELETE_STORES.forEach((store) => {
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
  }

  getCollection(STORE = null) {
    return new Promise((resolve, reject) => {
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        const db = databaseReq.result;

        // check collection contains or not
        if (db.objectStoreNames.contains(STORE)) {
          // collection transection
          const tx = db.transaction(STORE, "readonly");
          const txStore = tx.objectStore(STORE);
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
  }

  create(STORE = null, DATA = null) {
    return new Promise((resolve, reject) => {
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        const db = databaseReq.result;
        // collection transection
        const tx = db.transaction(STORE, "readwrite");
        const txStore = tx.objectStore(STORE);
        // collection data
        const data = txStore.add(DATA);

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
  }

  update(STORE = null, DATA = null) {
    return new Promise((resolve, reject) => {
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        const db = databaseReq.result;
        // collection transection
        const tx = db.transaction(STORE, "readwrite");
        const txStore = tx.objectStore(STORE);
        // put to collection data
        const data = txStore.put(DATA);

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
  }

  delete(STORE = null, KEY = null) {
    return new Promise((resolve, reject) => {
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        const db = databaseReq.result;
        // collection transection
        const tx = db.transaction(STORE, "readwrite");
        const txStore = tx.objectStore(STORE);
        // delete collection from data
        const data = txStore.delete(KEY);

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
  }

  clear(STORE = null) {
    return new Promise((resolve, reject) => {
      // open database
      const databaseReq = idb.open(this.DBNAME, this.VERSION);
      // handle database error
      databaseReq.onerror = (event) => {
        reject(Error(event.target?.error?.toString()));
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        const db = databaseReq.result;
        // collection transection
        const tx = db.transaction(STORE, "readwrite");
        const txStore = tx.objectStore(STORE);
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
  }
}

export default IndexedDB;
