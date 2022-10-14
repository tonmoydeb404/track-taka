import React, { useEffect } from "react";
import { useAuthContext } from "../contexts/authContext";
import { useGlobalContext } from "../contexts/globalContext";
import { useTransectionContext } from "../contexts/transectionContext";
import useSchedule from "../hooks/useSchedule";
import { uploadTransections } from "../services/transectionServices";

const AutoBackup = () => {
  const { user } = useAuthContext();

  const { autoBackup, setAutoBackup, setAutoBackupLastTime } =
    useGlobalContext();

  const { state } = useTransectionContext();

  const { lastTime, intervalDuration } = useSchedule({
    scheduleName: "AUTO_BACKUP",
    scheduleDuration: autoBackup?.duration * 24 * 60 * 60 * 1000,
    enableSchedule: autoBackup?.enable,
    scheduleAction: async () => {
      await uploadTransections({ uid: user.uid, data: state });
      // console.log("data backup", new Date().toLocaleString());
    },
  });

  // console.log({ next: new Date(lastTime + intervalDuration).toLocaleString() });

  // update last time
  useEffect(() => {
    setAutoBackupLastTime(lastTime);
  }, [lastTime]);

  // update autobackup
  useEffect(() => {
    if (user && user?.uid) {
      setAutoBackup(true);
    } else {
      setAutoBackup(false);
    }
  }, [user]);

  return <></>;
};

export default AutoBackup;
