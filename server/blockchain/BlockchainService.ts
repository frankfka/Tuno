import Web3 from 'web3';
import { Account } from 'web3-core';
import { Contract } from 'web3-eth-contract';
import jsonFetcher from '../../client/util/jsonFetcher';
import topPostTokenContractAbi from './contracts/topPostTokenContractAbi';
import MintTransactionResult from './MintTransactionResult';

export interface BlockchainService {
  mintTopPostNFT(
    authorAddress: string,
    metadataUri: string
  ): Promise<MintTransactionResult>;
}

type GasPriceResponse = {
  standard: number;
  fast: number;
  fastest: number;
};

/*
Localhost: http://127.0.0.1:7545
Localhost contract: 0x900C2941e3ad648fD9900818a4DafDf04341a8a8
Mumbai: https://polygon-mumbai.g.alchemy.com/v2/mSks1Uh4Qte5tMHqbg5V0BSiXXmn2JM-
Mumbai contract: 0x9AA0F6CCE9EAefc400A1a5350c1EbF87d4111509
 */

export class BlockchainServiceImpl implements BlockchainService {
  private readonly web3: Web3;
  private readonly topPostTokenContract: Contract;
  private readonly signingAccount: Account;

  constructor() {
    const maticEndpoint = process.env.MATIC_ENDPOINT;
    const signingAccountPrivateKey = process.env.MATIC_PRIVATE_KEY;
    const contractAddress = process.env.MATIC_CONTRACT_ADDRESS;

    if (
      maticEndpoint == null ||
      signingAccountPrivateKey == null ||
      contractAddress == null
    ) {
      throw Error('Required env vars not defined');
    }

    this.web3 = new Web3(maticEndpoint);

    this.topPostTokenContract = new this.web3.eth.Contract(
      topPostTokenContractAbi,
      contractAddress
    );

    this.signingAccount = this.web3.eth.accounts.privateKeyToAccount(
      signingAccountPrivateKey
    );
  }

  async mintTopPostNFT(
    authorAddress: string,
    metadataUri: string
  ): Promise<MintTransactionResult> {
    const transaction = this.topPostTokenContract.methods.awardTopPost(
      authorAddress,
      metadataUri
    );

    // Get gas prices, using the quoted "fast" gas price in Gwei
    const gasPriceInWei = (await this.getGasPricesInGWei()).fast * 10 ** 9;

    const signedTransaction = await this.web3.eth.accounts.signTransaction(
      {
        to: transaction._parent._address,
        from: this.signingAccount.address,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({
          from: this.signingAccount.address,
        }),
        gasPrice: gasPriceInWei,
      },
      this.signingAccount.privateKey
    );

    if (signedTransaction.rawTransaction == null) {
      throw Error('Raw transaction is not defined');
    }

    const transactionReceipt = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    const mintedTokenId = await this.getLastMintedTokenId();

    const transactionHash = transactionReceipt.transactionHash;

    return {
      tokenId: mintedTokenId,
      transactionHash,
      chain: 'matic-mumbai',
      authorAddress,
      metadataUri,
    };
  }

  private async getLastMintedTokenId(): Promise<number> {
    return this.topPostTokenContract.methods.lastTokenId().call();
  }

  private async getGasPricesInGWei(): Promise<GasPriceResponse> {
    return jsonFetcher('https://gasstation-mumbai.matic.today');
  }
}
