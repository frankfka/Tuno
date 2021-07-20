// Currently uses magic
// https://magic.link/docs/admin-sdk/node/api-reference#getmetadatabytoken
export default interface UserAuthData {
  authIdentifier: string // Magic decentralized ID
  email?: string;
}
