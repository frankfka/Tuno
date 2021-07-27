import TallyData, { ApiTallyData } from './TallyData';

export default interface GlobalState {
  tallies: TallyData[]; // In reverse chron. order
  voteLimit: number;
}

export interface ApiGlobalState extends Omit<GlobalState, 'tallies'> {
  tallies: ApiTallyData[];
}
