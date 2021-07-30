const getTransactionViewerUrl = (transactionHash: string): string => {
  return 'https://mumbai.polygonscan.com/tx/' + transactionHash;
};

export default getTransactionViewerUrl;
