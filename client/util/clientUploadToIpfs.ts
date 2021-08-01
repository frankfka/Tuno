type NftStorageUploadResponse = {
  cid: string;
};

// Uploads a file to IPFS using nft.storage
export const clientUploadToIpfs = async (file: File): Promise<string> => {
  const storageToken = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY;

  if (storageToken == null) {
    throw Error('Web3 Storage token not defined');
  }

  const uploadResponse = await fetch('https://api.web3.storage/upload', {
    method: 'POST',
    body: file,
    headers: {
      Authorization: 'Bearer ' + storageToken,
    },
  });

  const respJson: NftStorageUploadResponse = await uploadResponse.json();
  return respJson.cid;
};
