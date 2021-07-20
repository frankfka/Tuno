import {parse} from "cookie";
import type {NextApiRequest} from "next";

const getCookiesFromRequest = (req: NextApiRequest): Record<string, string> => {
  return req.cookies || parse(req.headers?.cookie || '');
}

export default getCookiesFromRequest;
