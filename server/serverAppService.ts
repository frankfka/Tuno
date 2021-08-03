import { format } from 'date-fns';

import Award from '../types/Award';
import GlobalState from '../types/GlobalState';
import TallyData from '../types/TallyData';
import User from '../types/User';
import UserProfile from '../types/UserProfile';
import AuthServiceImpl, { AuthService } from './auth/AuthService';
import UserAuthData from './auth/UserAuthData';
import {
  BlockchainService,
  BlockchainServiceImpl,
} from './blockchain/BlockchainService';
import {
  convertAwardDocumentToAward,
  convertGlobalStateDocumentToGlobalState,
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
import {
  MongoosePostData,
  MongoosePostDocument,
} from './database/models/MongoosePost';
import IpfsAwardMetadata from './ipfs/IpfsAwardMetadata';
import IpfsServiceImpl, { IpfsService } from './ipfs/IpfsService';
import { CreatePostParams, CreatePostResult } from './types/CreatePost';
import { GetAwardParams, GetAwardResult } from './types/GetAward';
import {
  GetAllPostsParams,
  GetPostsByAuthorParams,
  GetPostsByIdParams,
  GetPostsResult,
} from './types/GetPosts';
import {
  UpdateUserProfileErrorsResult,
  UpdateUserProfileParams,
  UpdateUserProfileResult,
  UserProfileUsernameError,
} from './types/UpdateUserProfile';

export interface ServerAppService {
  init(): Promise<void>;

  databaseService: DatabaseService;
  authService: AuthService;
  blockchainService: BlockchainService;
  ipfsService: IpfsService;

  /*
  Top level functions
   */

  // Globals
  getGlobalState(): Promise<GlobalState>;

  // Awards
  getAward(params: GetAwardParams): Promise<GetAwardResult>;

  // Posts
  createPost(params: CreatePostParams): Promise<CreatePostResult>;

  getAllPosts(params: GetAllPostsParams): Promise<GetPostsResult>;

  getPostsByAuthor(params: GetPostsByAuthorParams): Promise<GetPostsResult>;

  getPostsById(params: GetPostsByIdParams): Promise<GetPostsResult>;

  // Auth
  login(authHeader: string): Promise<UserAuthData | undefined>;

  logout(userAuth: UserAuthData): Promise<void>;

  // User
  updateProfile(
    params: UpdateUserProfileParams,
    currentUser: User
  ): Promise<UpdateUserProfileResult>;

  getUser(authIdentifier: string): Promise<User | undefined>;

  getUserByUsername(username: string): Promise<User | undefined>;

  // Tally
  tallyTopPost(): Promise<void>;
}

// TODO: Make this a thin wrapper for services, then extract handlers
class ServerAppServiceImpl implements ServerAppService {
  /*
  Initialization
   */

  databaseService!: DatabaseService;
  authService!: AuthService;
  blockchainService!: BlockchainService;
  ipfsService!: IpfsService;

  async init() {
    if (
      this.databaseService != null &&
      this.authService != null &&
      this.blockchainService != null &&
      this.ipfsService != null
    ) {
      return;
    }

    this.databaseService = new DatabaseServiceImpl();
    await this.databaseService.init();

    this.authService = new AuthServiceImpl();
    this.blockchainService = new BlockchainServiceImpl();
    this.ipfsService = new IpfsServiceImpl();
  }

  /*
  Global
   */
  async getGlobalState(): Promise<GlobalState> {
    return convertGlobalStateDocumentToGlobalState(
      await this.databaseService.getGlobalState()
    );
  }

  /*
  Awards
   */
  async getAward(params: GetAwardParams): Promise<GetAwardResult> {
    const award = await this.databaseService.getAward(params.id);

    return {
      award: award != null ? convertAwardDocumentToAward(award) : undefined,
    };
  }

  /*
  Posts
   */
  async createPost(params: CreatePostParams): Promise<CreatePostResult> {
    return {
      id: (
        await this.databaseService.createPost(params.content, params.authorId)
      ).id,
    };
  }

  async getAllPosts(params: GetAllPostsParams): Promise<GetPostsResult> {
    const { tallyIndex, minVoteScore } = params;

    const globalState = await this.databaseService.getGlobalState();
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

    return this.createGetPostsResult(postDocuments);
  }

  async getPostsByAuthor(
    params: GetPostsByAuthorParams
  ): Promise<GetPostsResult> {
    const { authorId } = params;

    const postDocuments = await this.databaseService.getPosts(
      getPostsFilter({
        authorId,
      }),
      getPostsSortBy({
        createdAt: 'desc',
      })
    );

    return this.createGetPostsResult(postDocuments);
  }

  async getPostsById(params: GetPostsByIdParams): Promise<GetPostsResult> {
    // TODO: Need to enforce order?
    const postDocuments = await this.databaseService.getPosts(
      getPostsFilter({
        postIds: params.ids,
      })
    );

    return this.createGetPostsResult(postDocuments);
  }

  private createGetPostsResult(
    postDocuments: MongoosePostDocument[],
    hasMore: boolean = false
  ): GetPostsResult {
    return {
      posts: postDocuments.map(convertPostDocumentToPost),
      hasMore,
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

    let user = await this.databaseService.getUserByAuthId(
      userAuth.authIdentifier
    );
    if (user == null) {
      console.log('No current user exists for this auth, creating new user');
      user = await this.databaseService.createUser(userAuth);
    }

    return userAuth;
  }

  async logout(userAuth: UserAuthData): Promise<void> {
    return this.authService.logout(userAuth);
  }

  async updateProfile(
    params: UpdateUserProfileParams,
    currentUser: User
  ): Promise<UpdateUserProfileResult> {
    const saveNewProfile = params.save;
    const validationErrors: UpdateUserProfileErrorsResult = {};

    // Construct new profile with some preprocessing
    const newUserProfile: UserProfile = {
      ...params.profile,
      // Write empty string as undefined to delete the username
      username: params.profile.username ? params.profile.username : undefined,
    };

    // Check username
    if (newUserProfile.username != null) {
      const userByUsername = await this.getUserByUsername(
        newUserProfile.username
      );
      if (userByUsername != null && userByUsername.id !== currentUser.id) {
        // Another user exists with this username
        validationErrors.username = UserProfileUsernameError.ALREADY_EXISTS;
      }
    }

    const newProfileIsValid = Object.keys(validationErrors).length === 0;

    let saved = false;
    let saveError: Error | undefined = undefined;
    if (newProfileIsValid && saveNewProfile) {
      try {
        await this.databaseService.saveProfileForUser(
          currentUser.id,
          newUserProfile
        );
        saved = true;
      } catch (err) {
        console.error('Error saving new profile to DB', err);
        saveError = err;
      }
    }

    return {
      valid: Object.keys(validationErrors).length === 0,
      validationErrors,
      saved,
      saveError,
    };
  }

  async getUser(authIdentifier: string): Promise<User | undefined> {
    const dbUser = await this.databaseService.getUserByAuthId(authIdentifier);
    if (dbUser == null) {
      return;
    }

    return convertUserDocumentToUser(dbUser);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const dbUser = await this.databaseService.getUserByUsername(username);
    if (dbUser == null) {
      return;
    }

    return convertUserDocumentToUser(dbUser);
  }

  /*
  Tally
   */

  async tallyTopPost(): Promise<void> {
    const globalState = await this.databaseService.getGlobalState();

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

    const topPost = postsByScore.length > 0 ? postsByScore[0] : undefined;

    // Skip this tally if there are no posts, or no votes
    if (topPost == null) {
      console.log('No top posts, skipping this tally');
      return;
    }

    // Get author (TODO: just use populate)
    const author = await this.databaseService.getUserById(topPost.author);

    if (author == null) {
      throw Error('No user associated with top post with ID ' + topPost.id);
    }

    // Get the web3 account for the user, creating and saving a new one if not exists
    let web3Account = author.web3;
    if (web3Account == null) {
      console.log('Author does not have a Web 3 account, making one.');

      web3Account = await this.blockchainService.createWeb3Account();
      await this.databaseService.saveWeb3AccountForUser(
        topPost.author,
        web3Account
      );

      console.log(
        'Saved web3 account for author:',
        author.id,
        'address:',
        web3Account.address
      );
    }

    // TODO Extract creating this stuff into another file
    const dateStr = format(topPost.createdAt, 'yyyy-MM-dd');
    const tokenName = 'TPA-' + dateStr;
    const tokenDescription = `Top post award token for tally on ${dateStr}`;
    const imageUri = ''; // TODO

    // Create metadata
    const topPostMetadata: IpfsAwardMetadata = {
      name: tokenName,
      description: tokenDescription,
      image: imageUri,
      authorAddress: web3Account.address,
      createdAt: topPost.createdAt,
      postSource: topPost.source.value,
      voteScore: topPost.voteScore,
    };

    // Save metadata as JSON to IPFS
    const savedMetadataHash = await this.ipfsService.saveAwardMetadata(
      tokenName, // Token name as file name
      topPostMetadata
    );
    const savedMetadataUri = 'ipfs://' + savedMetadataHash;

    console.log('Saved token metadata at URI', savedMetadataUri);

    // Call blockchain to mint token
    const mintTransactionResult = await this.blockchainService.mintTopPostNFT(
      web3Account.address,
      savedMetadataUri
    );

    console.log(
      'Minted top post NFT with hash',
      mintTransactionResult.transactionHash
    );

    // Create the award object and save it
    const award: Omit<Award, 'id'> = {
      createdAt: new Date(),
      ipfsMetadata: topPostMetadata,
      refs: {
        author: author.id,
        post: topPost.id,
      },
      tokenData: mintTransactionResult,
    };
    const savedAward = await this.databaseService.saveAward(award);

    console.log('Saved new award to DB with ID', savedAward.id);

    // Update post with the saved award
    await this.databaseService.awardPost(topPost.id, savedAward.id);

    console.log('Updated post with award');

    const tallyData: TallyData = {
      tallyTime: new Date(),
      awards: [savedAward.id],
    };

    // Save to DB
    await this.databaseService.recordTally(tallyData);

    console.log('Record tally completed with saved tally ID');
  }
}

let cachedService: ServerAppService | undefined = undefined;

export const getServerAppService = async (): Promise<ServerAppService> => {
  if (cachedService != null) {
    console.log('Returning cached service');
    await cachedService.init();
    return cachedService;
  }

  console.log('Creating new app service');

  const svc = new ServerAppServiceImpl();
  await svc.init();

  cachedService = svc;
  return cachedService;
};
