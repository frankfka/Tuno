import type {NextApiRequest, NextApiResponse} from "next";
import {getServerAppService} from "../../../server/services/serverAppService";
import getCookiesFromRequest from "../../../util/getCookiesFromRequest";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const session = await appService.authService.getSessionFromCookies(getCookiesFromRequest(req))

  // TODO: Get user, not auth
  res.status(200).json({ user: session || null })
}
