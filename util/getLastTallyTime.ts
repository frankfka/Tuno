import { parseISO } from 'date-fns';
import TallyData, { ApiTallyData } from '../types/TallyData';
import getApiSafeDate from './getApiSafeDate';

const getLastTallyTime = (tallies: (TallyData | ApiTallyData)[]): Date => {
  if (tallies.length > 0) {
    return getApiSafeDate(tallies[0].tallyTime);
  }

  return new Date(2000, 0, 1);
};

export default getLastTallyTime;
