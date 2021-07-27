import { useEffect } from 'react';
import Router from 'next/router';
import useSWR, { mutate, SWRResponse } from 'swr';
import EndpointResult from '../../types/EndpointResult';
import User from '../../types/User';

type RedirectPath = string;
type UseUserVariables = {
  redirect?: {
    ifAuthed?: RedirectPath;
    ifNotAuthed?: RedirectPath;
  };
};

export type UseUserState = {
  loading: boolean;
  swr: SWRResponse<EndpointResult<User>, Error>;
  user?: User;
  error?: Error;
};

export const GET_USER_SWR_KEY = '/api/auth/user';

export default function useUser(variables: UseUserVariables): UseUserState {
  const { redirect } = variables;

  const swr = useSWR<EndpointResult<User>>(GET_USER_SWR_KEY);
  const { data, error } = swr;

  const user = data?.data;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirect || !finished) {
      return;
    }

    if (hasUser && redirect?.ifAuthed != null) {
      Router.push(redirect.ifAuthed);
    } else if (!hasUser && redirect?.ifNotAuthed != null) {
      Router.push(redirect.ifNotAuthed);
    }
  }, [redirect?.ifAuthed, redirect?.ifNotAuthed, finished, hasUser]);

  return {
    loading: !finished,
    user,
    error,
    swr,
  };
}
