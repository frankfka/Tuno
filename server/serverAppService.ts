import TallyData from '../types/TallyData';
import User from '../types/User';
import AuthServiceImpl, { AuthService } from './auth/AuthService';
import UserAuthData from './auth/UserAuthData';
import {
  BlockchainService,
  BlockchainServiceImpl,
} from './blockchain/BlockchainService';
import {
  convertPostDocumentToPost,
  convertUserDocumentToUser,
} from './database/converters';
import DatabaseServiceImpl, {
  DatabaseService,
} from './database/DatabaseService';
import {
  getPostsFilter,
  getPostsSortBy,
} from './database/helpers/databasePostUtils';
import { GetPostsParams, GetPostsResult } from './types/GetPosts';

export interface ServerAppService {
  init(): Promise<void>;
  databaseService: DatabaseService;
  authService: AuthService;
  blockchainService: BlockchainService;

  /*
  Top level functions
   */

  // Posts
  getPosts(params: GetPostsParams): Promise<GetPostsResult>;

  // Auth
  login(authHeader: string): Promise<UserAuthData | undefined>;
  logout(userAuth: UserAuthData): Promise<void>;
  getUser(authIdentifier: string): Promise<User | undefined>;

  // Tally
  tallyTopPost(): Promise<void>;
}

class ServerAppServiceImpl implements ServerAppService {
  /*
  Initialization
   */

  databaseService!: DatabaseService;
  authService!: AuthService;
  blockchainService!: BlockchainService;

  async init() {
    this.databaseService = new DatabaseServiceImpl();
    await this.databaseService.init();

    this.authService = new AuthServiceImpl();
    this.blockchainService = new BlockchainServiceImpl();
  }

  /*
  Posts
   */

  async getPosts(params: GetPostsParams): Promise<GetPostsResult> {
    const { tallyIndex, minVoteScore } = params;

    const globalState = await this.databaseService.getGlobalStateData();
    const numPastTallies = globalState.tallies.length;

    // Param
    if (tallyIndex < 0 || tallyIndex > numPastTallies) {
      return {
        posts: [],
        hasMore: false,
      };
    }

    // Get dates from tally index
    const startTime =
      tallyIndex < numPastTallies
        ? globalState.tallies[tallyIndex].tallyTime
        : undefined;
    const endTime =
      tallyIndex > 0
        ? globalState.tallies[tallyIndex - 1].tallyTime
        : undefined;

    const postDocuments = await this.databaseService.getPosts(
      getPostsFilter({ startTime, endTime, minVoteScore }),
      getPostsSortBy({
        createdAt: tallyIndex === 0 ? 'desc' : undefined, // Rev chronological order for current tally
        voteScore: tallyIndex > 0 ? 'desc' : undefined, // Sort by score for past tallies
      })
    );
    const posts = postDocuments.map((doc) => convertPostDocumentToPost(doc));

    return {
      posts,
      hasMore: tallyIndex === numPastTallies,
    };
  }

  /*
  Auth
   */

  async login(authHeader: string): Promise<UserAuthData | undefined> {
    const userAuth = await this.authService.login(authHeader);

    if (userAuth == null) {
      console.error('No user auth resulted from authService login');
      return;
    }

    let user = await this.databaseService.getUser(userAuth.authIdentifier);
    if (user == null) {
      console.log('No current user exists for this auth, creating new user');
      user = await this.databaseService.createUser(userAuth);
    }

    return userAuth;
  }

  async logout(userAuth: UserAuthData): Promise<void> {
    return this.authService.logout(userAuth);
  }

  async getUser(authIdentifier: string): Promise<User | undefined> {
    const dbUser = await this.databaseService.getUser(authIdentifier);
    if (dbUser == null) {
      return;
    }

    return convertUserDocumentToUser(dbUser);
  }

  /*
  Tally
   */

  async tallyTopPost(): Promise<void> {
    const globalState = await this.databaseService.getGlobalStateData();

    // Get top posts since last tally
    const lastTallyTime =
      globalState.tallies.length > 0
        ? globalState.tallies[0].tallyTime
        : undefined;

    const postsByScore = await this.databaseService.getPosts(
      getPostsFilter({
        startTime: lastTallyTime,
        minVoteScore: 1,
      }),
      getPostsSortBy({
        voteScore: 'desc',
        createdAt: 'desc',
      })
    );

    const topPostId = postsByScore.length > 0 ? postsByScore[0].id : undefined;

    const tallyData: TallyData = {
      tallyTime: new Date(),
      topPost: topPostId,
    };

    // Save to DB
    await this.databaseService.recordTally(tallyData);
  }
}

let cachedService: ServerAppService | undefined = undefined;

export const getServerAppService = async (): Promise<ServerAppService> => {
  if (cachedService != null) {
    console.log('Returning cached service');
    return cachedService;
  }

  console.log('Creating new app service');
  cachedService = new ServerAppServiceImpl();
  await cachedService.init();

  return cachedService;
};
