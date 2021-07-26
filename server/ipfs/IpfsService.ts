import fleekStorage from '@fleekhq/fleek-storage-js';
import IpfsAwardMetadata from './IpfsAwardMetadata';

export interface IpfsService {
  saveAwardMetadata(
    fileName: string,
    metadata: IpfsAwardMetadata
  ): Promise<string>;
}

type FleekCredentials = {
  apiKey: string;
  apiSecret: string;
};

export default class IpfsServiceImpl implements IpfsService {
  private readonly fleekCredentials: FleekCredentials;

  constructor() {
    const fleekApiKey = process.env.FLEEK_API_KEY;
    const fleekApiSecret = process.env.FLEEK_API_SECRET;

    if (fleekApiKey == null || fleekApiSecret == null) {
      throw Error('Fleek API credentials not defined');
    }
    this.fleekCredentials = {
      apiKey: fleekApiKey,
      apiSecret: fleekApiSecret,
    };
  }

  async saveAwardMetadata(
    fileName: string,
    metadata: IpfsAwardMetadata
  ): Promise<string> {
    // TODO this gives without hash prefix
    const uploadedFile = await fleekStorage.upload({
      apiKey: this.fleekCredentials.apiKey,
      apiSecret: this.fleekCredentials.apiSecret,
      key: `post-award-metadata/${fileName}.json`,
      data: JSON.stringify(metadata),
    });

    return uploadedFile.hash;
  }
}
