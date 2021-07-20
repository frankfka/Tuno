import User from '../../types/User';
import AuthServiceImpl, { AuthService } from './auth/AuthService';
import UserAuthData from './auth/UserAuthData';
import { convertUserDocumentToUser } from './database/converters';
import DatabaseServiceImpl, {
  DatabaseService,
} from './database/DatabaseService';

export interface ServerAppService {
  init(): Promise<void>;
  databaseService: DatabaseService;
  authService: AuthService;

  /*
  Top level functions
   */

  // Auth
  login(authHeader: string): Promise<UserAuthData | undefined>;
  logout(userAuth: UserAuthData): Promise<void>;
  getUser(authIdentifier: string): Promise<User | undefined>;
}

class ServerAppServiceImpl implements ServerAppService {
  /*
  Initialization
   */

  databaseService!: DatabaseService;
  authService!: AuthService;

  async init() {
    this.databaseService = new DatabaseServiceImpl();
    await this.databaseService.init();

    this.authService = new AuthServiceImpl();
  }

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
