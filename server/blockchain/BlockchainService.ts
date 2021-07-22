import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import topPostTokenContractAbi from './contracts/topPostTokenContractAbi';

export interface BlockchainService {
  mintTopPostNFT(authorAddress: string, metadataUri: string): Promise<void>;
}

export class BlockchainServiceImpl implements BlockchainService {
  private readonly web3: Web3;

  private readonly topPostTokenContract: Contract;

  constructor() {
    const url =
      'https://polygon-mumbai.g.alchemy.com/v2/mSks1Uh4Qte5tMHqbg5V0BSiXXmn2JM-';

    // Using web3js
    this.web3 = new Web3(url);

    this.topPostTokenContract = new this.web3.eth.Contract(
      topPostTokenContractAbi,
      '0x62615e397aa63677bA7c749f9Cd7D607Ed5202eB'
    );

    // const test = contract.methods
    //   .MINTER_ROLE()
    //   .call()
    //   .then((res) => {
    //     console.log('Test complete!');
    //     console.log(res);
    //   });
    //
    // console.log(contract.methods);
  }

  // TODO: Need to store metadata in IPFS
  async mintTopPostNFT(authorAddress: string, metadataUri: string) {
    const privateKey =
      '177338130308784b4e4f5a0374accfd149213e44787bfc6ed671187d4c7dd15c';
    const account =
      this.web3.eth.accounts.privateKeyToAccount(privateKey).address;

    console.log('ACCOUNT');
    console.log(account);

    const transaction = this.topPostTokenContract.methods.awardTopPost(
      authorAddress,
      metadataUri
    );

    console.log('TXN');
    console.log(transaction);

    console.log('Gas');
    console.log(await transaction.estimateGas({ from: account }));

    const signed = await this.web3.eth.accounts.signTransaction(
      {
        to: transaction._parent._address,
        from: account,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({ from: account }),
        gasPrice: 500,
      },
      privateKey
    );

    console.log('SIGNED');
    console.log(signed);
    const receipt = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction!
    );

    console.log('RECEIPT');
    console.log(receipt);
  }
}
