import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGlobal } from "../contexts/GlobalContext";
import { useTransection } from "../contexts/TransectionContext";
import useSchedule from "../hooks/useSchedule";
import { uploadTransections } from "../services/transectionServices";

const AutoBackup = () => {
  const { user } = useAuth();
  const { autoBackup, setAutoBackup, setAutoBackupLastTime } = useGlobal();
  const { transections } = useTransection();

  const { lastTime, intervalDuration } = useSchedule({
    scheduleName: "AUTO_BACKUP",
    scheduleDuration: autoBackup?.duration * 24 * 60 * 60 * 1000,
    enableSchedule: autoBackup?.enable,
    scheduleAction: async () => {
      await uploadTransections({ uid: user.uid, data: transections });
      // console.log("data backup", new Date().toLocaleString());
    },
  });

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
