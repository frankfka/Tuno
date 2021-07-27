import { startOfTomorrow } from 'date-fns';
import { useEffect, useState } from 'react';

const getStartOfTomorrowUTC = (): Date => {
  const startOfTomorrowWithTimeZone = startOfTomorrow();

  return new Date(
    Date.UTC(
      startOfTomorrowWithTimeZone.getFullYear(),
      startOfTomorrowWithTimeZone.getMonth(),
      startOfTomorrowWithTimeZone.getDate()
    )
  );
};

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
