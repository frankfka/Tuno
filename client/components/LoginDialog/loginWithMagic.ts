import { Magic } from 'magic-sdk';
import Router from 'next/router';
import createPostFetchInit from '../../util/createPostFetchInit';

// Uses Magic to go through a login workflow
const loginWithMagic = async (
  email: string,
  onLoginSuccess: () => void,
  onLoginFailed: (err: Error) => void
) => {
  const magicApiKey = process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY;

  if (magicApiKey == null || !magicApiKey) {
    onLoginFailed(new Error('Magic API key not defined'));
    return;
  }

  try {
    const magic = new Magic(magicApiKey);
    const didToken = await magic.auth.loginWithMagicLink({
      email,
    });

    const loginResponse = await fetch(
      '/api/auth/login',
      createPostFetchInit({
        body: {
          email,
        },
        headers: {
          Authorization: 'Bearer ' + didToken,
        },
      })
    );

    if (loginResponse.status === 200) {
      onLoginSuccess();
      // await Router.push('/');
    } else {
      onLoginFailed(
        new Error(
          `Error logging in: ${JSON.stringify(await loginResponse.json())}`
        )
      );
    }
  } catch (err) {
    onLoginFailed(err);
  }
};

export default loginWithMagic;
