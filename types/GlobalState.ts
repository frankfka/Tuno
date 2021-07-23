import TallyData from './TallyData';

export default interface GlobalState {
  tallies: TallyData[]; // In reverse chron. order
  voteLimit: number;
}
