import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import topPostTokenContractAbi from './contracts/topPostTokenContractAbi';

export interface BlockchainService {
  test(): Promise<void>;
  mintTopPostNFT(authorAddress: string, metadataUri: string): Promise<void>;
}

export class BlockchainServiceImpl implements BlockchainService {
  private readonly web3: Web3;

  private readonly topPostTokenContract: Contract;

  constructor() {
    const url = 'HTTP://127.0.0.1:7545';

    // Using web3js
    this.web3 = new Web3(url);

    this.topPostTokenContract = new this.web3.eth.Contract(
      topPostTokenContractAbi,
      '0x900C2941e3ad648fD9900818a4DafDf04341a8a8' // '0x62615e397aa63677bA7c749f9Cd7D607Ed5202eB'
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

  async test() {
    console.log(
      await this.topPostTokenContract.methods
        .balanceOf('0xcF6cA736f2994cC5C0Bb595232634A03E85e9293')
        .call()
    );
    console.log(await this.topPostTokenContract.methods.tokenURI(1).call());
  }

  // TODO: Need to store metadata in IPFS
  async mintTopPostNFT(authorAddress: string, metadataUri: string) {
    const privateKey =
      '766914641fe8abfee2f03dc42506790b5f6942559adbd1b0b9ed06e9e9d9fda1';
    const account =
      this.web3.eth.accounts.privateKeyToAccount(privateKey).address;

    console.log('ACCOUNT');
    console.log(account);

    const transaction = this.topPostTokenContract.methods.awardTopPost(
      '0xcF6cA736f2994cC5C0Bb595232634A03E85e9293',
      'test'
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
