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

// TODO: https://docs.web3.storage/how-tos/store/#installing-the-client
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
    const uploadedFile = await fleekStorage.upload({
      apiKey: this.fleekCredentials.apiKey,
      apiSecret: this.fleekCredentials.apiSecret,
      key: `post-award-metadata/${fileName}.json`,
      data: JSON.stringify(metadata),
    });

    // The hash is without the ipfs:// prefix
    return uploadedFile.hash;
  }
}
