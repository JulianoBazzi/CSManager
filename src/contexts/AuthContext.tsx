import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { User } from '@supabase/supabase-js';
import Router from 'next/router';
import { destroyCookie, setCookie } from 'nookies';

import { useFeedback } from '~/contexts/FeedbackContext';
import { ISignIn } from '~/models/ISignIn';
import supabase from '~/services/supabase';

interface IAuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  user?: User;
  signIn(credentials: ISignIn): Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

export function logout() {
  destroyCookie(undefined, 'pri.user', { path: '/' });
  destroyCookie(undefined, 'pri.token', { path: '/' });
  destroyCookie(undefined, 'pri.refreshToken', { path: '/' });
  destroyCookie(undefined, 'pri.workdayBreak', { path: '/' });

  Router.push('/login');
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const { errorFeedbackToast, warningFeedbackToast, successFeedbackToast } = useFeedback();
  const [user, setUser] = useState<User>();

  const signIn = useCallback(
    async ({ email, password }: ISignIn) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        errorFeedbackToast('Login', error);
        return;
      }

      if (!data || !data.user) {
        warningFeedbackToast('Login', 'Usuário não encontrado!');
        return;
      }

      setUser(data.user);
      setCookie(undefined, 'csm.user', JSON.stringify(data.user), {
        maxAge: 60 * 60 * 24 * 3, // 3 days
        path: '/',
      });

      successFeedbackToast('Login', 'Login efetuado com sucesso!');
      await Router.push('/');
    },
    [errorFeedbackToast, warningFeedbackToast, successFeedbackToast]
  );

  const authProviderValue = useMemo(
    () => ({
      user,
      signIn,
    }),
    [user, signIn]
  );

  return <AuthContext.Provider value={authProviderValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
