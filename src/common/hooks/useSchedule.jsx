import { useEffect, useState } from "react";

const useSchedule = ({
  scheduleName = null,
  scheduleDuration = null,
  scheduleAction = () => {},
  enableSchedule = false,
}) => {
  const [lastTime, setLastTime] = useState(Date.now());
  const [intervalDuration, setIntervalDuration] = useState(scheduleDuration);
  const [schedule, setSchedule] = useState(enableSchedule);

  // get last time from localstorage
  useEffect(() => {
    const localState = localStorage.getItem(`LAST_TIME_${scheduleName}`);
    if (localState && localState != null) {
      setLastTime(JSON.parse(localState));
    } else {
      setLastTime(Date.now());
    }
  }, []);

  // set last time to localstorage
  useEffect(() => {
    localStorage.setItem(`LAST_TIME_${scheduleName}`, JSON.stringify(lastTime));
  }, [lastTime]);

  // update schedule duration
  useEffect(() => {
    if (scheduleDuration) {
      setIntervalDuration(scheduleDuration);
    }

    return () => {
      setIntervalDuration(0);
    };
  }, [scheduleDuration]);

  // update schedule
  useEffect(() => {
    setSchedule(enableSchedule);
  }, [enableSchedule]);

  // timeout
  useEffect(() => {
    const current = new Date().getTime();
    const next = lastTime + intervalDuration;

    // timeout
    const timeout = setTimeout(() => {
      setLastTime(Date.now());
      scheduleAction();
    }, next - current);

    // time out on off
    if (!schedule) {
      clearTimeout(timeout);
    }

    // clean up
    return () => {
      clearTimeout(timeout);
    };
  }, [lastTime, intervalDuration, schedule]);

  return {
    lastTime,
    setLastTime,
    intervalDuration,
    setIntervalDuration,
    schedule,
    setSchedule,
  };
};

export default useSchedule;
