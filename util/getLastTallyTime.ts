import { parseISO } from 'date-fns';
import TallyData, { ApiTallyData } from '../types/TallyData';

const getLastTallyTime = (tallies: (TallyData | ApiTallyData)[]): Date => {
  if (tallies.length > 0) {
    const lastTallyTime = tallies[0].tallyTime;
    return typeof lastTallyTime === 'string'
      ? parseISO(lastTallyTime)
      : lastTallyTime;
  }

  return new Date(2000, 0, 1);
};

export default getLastTallyTime;
