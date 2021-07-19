import {Mongoose} from "mongoose";
import DatabaseServiceImpl, {DatabaseService} from "./database/DatabaseService";

export interface AppService {
  init(): Promise<void>;
  databaseService: DatabaseService;
}

class AppServiceImpl implements AppService {

  /*
  Initialization
   */

  databaseService!: DatabaseService;

  async init() {
    this.databaseService = new DatabaseServiceImpl();
    await this.databaseService.init();
  }
}

let cachedService: AppService | undefined = undefined;

export const getAppService = async (): Promise<AppService> => {
  if (cachedService != null) {
    console.log("Returning cached service")
    return cachedService
  }

  console.log("Creating new app service")
  cachedService = new AppServiceImpl();
  await cachedService.init();

  return cachedService;
}
