const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

class IndexedDB {
  constructor(DBNAME, VERSION, STORE, KEY_PATH, OLD_STORE = null) {
    this.DBNAME = DBNAME;
    this.VERSION = VERSION;
    this.STORE = STORE;
    this.KEY_PATH = KEY_PATH;
    this.OLD_STORE = OLD_STORE;
  }

  init() {
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

        // handle stores
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE, {
            keyPath: this.KEY_PATH,
          });
          response[this.STORE] = `created successfull`;
        } else {
          response[this.STORE] = `allready created`;
        }

        // handle old store
        if (this.OLD_STORE && db.objectStoreNames.contains(this.OLD_STORE)) {
          db.deleteObjectStore(this.OLD_STORE);
          response[this.OLD_STORE] = `deleted successfull`;
        }

        resolve(response);
      };
      // handle database success
      databaseReq.onsuccess = (event) => {
        resolve("no new collection to create");
      };
    });
  }

  getCollection() {
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
        if (db.objectStoreNames.contains(this.STORE)) {
          // collection transection
          const tx = db.transaction(this.STORE, "readonly");
          const txStore = tx.objectStore(this.STORE);
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

  create(DATA = null) {
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
        const tx = db.transaction(this.STORE, "readwrite");
        const txStore = tx.objectStore(this.STORE);
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

  update(DATA = null) {
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
        const tx = db.transaction(this.STORE, "readwrite");
        const txStore = tx.objectStore(this.STORE);
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

  delete(KEY = null) {
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
        const tx = db.transaction(this.STORE, "readwrite");
        const txStore = tx.objectStore(this.STORE);
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

  clear() {
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
        const tx = db.transaction(this.STORE, "readwrite");
        const txStore = tx.objectStore(this.STORE);
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
