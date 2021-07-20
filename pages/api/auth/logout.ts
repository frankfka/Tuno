import type {NextApiRequest, NextApiResponse} from "next";
import {getServerAppService} from "../../../server/services/serverAppService";
import getCookiesFromRequest from "../../../util/getCookiesFromRequest";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
  const appService = await getServerAppService();
  const session = await appService.authService.getSessionFromCookies(getCookiesFromRequest(req))


  if (session) {
    await appService.authService.logout(session);

    res.setHeader('Set-Cookie', appService.authService.getInvalidatedSessionTokenCookie())
  }

  res.status(200).send({ done: true })
}
