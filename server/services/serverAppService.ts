import AuthServiceImpl, {AuthService} from "./auth/AuthService";
import DatabaseServiceImpl, {DatabaseService} from "./database/DatabaseService";

export interface ServerAppService {
  init(): Promise<void>;
  databaseService: DatabaseService;
  authService: AuthService;
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
}

let cachedService: ServerAppService | undefined = undefined;

export const getServerAppService = async (): Promise<ServerAppService> => {
  if (cachedService != null) {
    console.log("Returning cached service")
    return cachedService
  }

  console.log("Creating new app service")
  cachedService = new ServerAppServiceImpl();
  await cachedService.init();

  return cachedService;
}
