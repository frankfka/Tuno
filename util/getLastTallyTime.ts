import TallyData from '../types/TallyData';

const getLastTallyTime = (tallies: TallyData[]): Date => {
  if (tallies.length > 0) {
    return tallies[0].tallyTime;
  }

  return new Date(2000, 0, 1);
};

export default getLastTallyTime;
