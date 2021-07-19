const getCidGatewayUrl = (cid: string): string => {
  return `https://ipfs.io/ipfs/${cid}`;
}

export default getCidGatewayUrl;
