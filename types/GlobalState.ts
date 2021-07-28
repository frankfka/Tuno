import TallyData, { ApiTallyData } from './TallyData';

export default interface GlobalState {
  tallies: TallyData[]; // In reverse chron. order
  voteLimit: number;
  nextTallyTime: Date;
}

export interface ApiGlobalState
  extends Omit<GlobalState, 'tallies' | 'nextTallyTime'> {
  tallies: ApiTallyData[];
  nextTallyTime: string;
}
