import Iron from '@hapi/iron';
import { Magic } from '@magic-sdk/admin';
import { serialize } from 'cookie';
import UserAuthData from './UserAuthData';

export interface AuthService {
  // Login/Logout
  login(authHeader: string): Promise<UserAuthData | undefined>;

  logout(auth: UserAuthData): Promise<void>;

  // Cookie utils
  getSessionTokenCookie(session: UserAuthData): Promise<string>;

  getInvalidatedSessionTokenCookie(): string;

  getSessionFromCookies(
    cookies: Record<string, string>
  ): Promise<UserAuthData | undefined>;
}

export default class AuthServiceImpl implements AuthService {
  private readonly magicAuth: Magic;

  // Cookies
  private readonly authTokenSecret: string;
  private readonly authTokenCookieName: string = 'session-token';
  private readonly authTokenCookieMaxAge: number = 60 * 60 * 8; // 8 Hours

  constructor() {
    // Create magic client
    const magicSecretKey = process.env.MAGIC_SECRET_KEY;
    if (magicSecretKey == null || typeof magicSecretKey != 'string') {
      throw Error('Magic secret key not defined');
    }
    this.magicAuth = new Magic(magicSecretKey);

    // Auth token secret for @hapi/iron
    const authTokenSecret = process.env.AUTH_TOKEN_SECRET;
    if (authTokenSecret == null) {
      throw Error('Auth token secret not defined');
    }
    this.authTokenSecret = authTokenSecret;
  }

  async login(authHeader: string): Promise<UserAuthData | undefined> {
    try {
      const didToken =
        this.magicAuth.utils.parseAuthorizationHeader(authHeader);
      const userMetadata = await this.magicAuth.users.getMetadataByToken(
        didToken
      );

      if (!userMetadata.email || !userMetadata.issuer) {
        return;
      }

      return {
        email: userMetadata.email,
        authIdentifier: userMetadata.issuer,
      };
    } catch (err) {
      console.error(
        'Error logging in with auth header: ',
        authHeader,
        'Error: ',
        err
      );
    }
  }

  async logout(auth: UserAuthData): Promise<void> {
    await this.magicAuth.users.logoutByIssuer(auth.authIdentifier);
  }

  async getSessionTokenCookie(session: UserAuthData): Promise<string> {
    const createdAt = Date.now();

    const sessionTokenData = {
      ...session,
      createdAt,
      maxAge: this.authTokenCookieMaxAge,
    };

    const token = await Iron.seal(
      sessionTokenData,
      this.authTokenSecret,
      Iron.defaults
    );

    return serialize(this.authTokenCookieName, token, {
      maxAge: this.authTokenCookieMaxAge,
      expires: new Date(createdAt + this.authTokenCookieMaxAge * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
  }

  getInvalidatedSessionTokenCookie(): string {
    return serialize(this.authTokenCookieName, '', {
      maxAge: -1,
      path: '/',
    });
  }

  async getSessionFromCookies(
    cookies: Record<string, string>
  ): Promise<UserAuthData | undefined> {
    const authToken = cookies[this.authTokenCookieName];

    if (!authToken) {
      return;
    }

    const session = await Iron.unseal(
      authToken,
      this.authTokenSecret,
      Iron.defaults
    );
    const expiresAt = session.createdAt + session.maxAge * 1000;

    // Validate the expiration date of the session
    if (Date.now() > expiresAt) {
      console.log('Session expired');
      return;
    }

    return session;
  }
}
