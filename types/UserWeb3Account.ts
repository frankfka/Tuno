export interface SafeUserWeb3Account {
  address: string;
}

export default interface UserWeb3Account extends SafeUserWeb3Account {
  privateKey: string;
}
