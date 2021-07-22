const getLastTallyTime = (tallyTimes: Date[]): Date => {
  if (tallyTimes.length > 0) {
    return tallyTimes[0];
  }

  return new Date(2000, 0, 1);
};

export default getLastTallyTime;
