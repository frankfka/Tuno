import Award, { ApiAward } from '../../types/Award';
import Post, { ApiPost } from '../../types/Post';

export type GetAwardParams = {
  id: string;
};

export type GetAwardResult = {
  award?: Award;
};

export type ApiGetAwardResult = Omit<GetAwardResult, 'award'> & {
  award?: ApiAward;
};
