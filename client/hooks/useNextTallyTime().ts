import { startOfTomorrow } from 'date-fns';
import { useEffect, useState } from 'react';

const getStartOfTomorrowUTC = (): Date => {
  const startOfTomorrowWithTimeZone = startOfTomorrow();

  let start = new Date();
  start.setUTCHours(0, 0, 0, 0);

  return new Date(
    Date.UTC(
      startOfTomorrowWithTimeZone.getFullYear(),
      startOfTomorrowWithTimeZone.getMonth(),
      startOfTomorrowWithTimeZone.getDate()
    )
  );
};

// TODO: Consider storing this in the DB as part of global state?
// Next tally time is start of tomorrow in UTC
const useNextTallyTime = (refreshIntervalInMs?: number): Date => {
  const [nextTallyTime, setNextTallyTime] = useState(getStartOfTomorrowUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setNextTallyTime(getStartOfTomorrowUTC());
    }, refreshIntervalInMs ?? 1000);
    return () => clearInterval(interval);
  }, [refreshIntervalInMs, setNextTallyTime]);

  return nextTallyTime;
};

export default useNextTallyTime;
