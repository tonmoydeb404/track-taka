import { useEffect, useMemo, useState } from "react";
import {
  createDocument,
  deleteDocument,
  readCollectionRealtime,
  updateDocument,
} from "../../lib/database";
import { useGlobal } from "../contexts/globalContext";

const useUserTransections = (uid) => {
  const { isOnline } = useGlobal();
  // transection state
  const [userTransections, setUserTransections] = useState(null);
  const [transectionLoading, setTransectionLoading] = useState(true);
  // transection collection path
  const collection = useMemo(() => ["users", uid, "transections"], [uid]);

  const createTransection = async (transection = {}) => {
    try {
      // new transection
      const newTransection = {
        ...transection,
        createdAt: Date.now(),
      };
      // create data to database
      const response = await createDocument(
        collection,
        newTransection.id,
        newTransection
      );

      // console.log(response);
    } catch (error) {
      console.error("error");
    }
  };
  const updateTransection = async (id, transection = {}) => {
    try {
      // update data to database
      const response = await updateDocument(collection, id, transection);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteTransection = async (idList = []) => {
    try {
      // delete data to database
      const promises = idList.map(
        async (id) => await deleteDocument(collection, id)
      );
      const response = await Promise.all(promises);

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  // fetch transection data
  useEffect(() => {
    let unsubscribe = () => {};
    if (uid) {
      // subscribe to transection snapshot
      unsubscribe = readCollectionRealtime(collection)((data) => {
        setUserTransections(data);
      });
    }
    return () => {
      // unsubscribe from transection snapshot
      unsubscribe();
      setUserTransections([]);
    };
  }, [uid]);

  // transection loading state
  useEffect(() => {
    if (userTransections !== null) setTransectionLoading(false);
  }, [userTransections]);

  // // network
  // useEffect(() => {
  //   if (isOnline) {
  //     enableNetwork(db);
  //   } else {
  //     disableNetwork(db);
  //   }
  // }, [isOnline]);

  return {
    userTransections,
    createTransection,
    updateTransection,
    deleteTransection,
    transectionLoading,
  };
};

export default useUserTransections;
