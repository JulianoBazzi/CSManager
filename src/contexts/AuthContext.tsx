import {
  createContext, type ReactNode, useCallback, useContext, useMemo,
} from 'react';

import { useRouter } from 'next/navigation';
import { destroyCookie, setCookie } from 'nookies';

import { useFeedback } from '~/contexts/FeedbackContext';
import type IChangePassword from '~/models/IChangePassword';
import type IProfile from '~/models/IProfile';
import type ISignIn from '~/models/ISignIn';
import supabase from '~/services/supabase';

interface IAuthProviderProps {
  children: ReactNode;
}

type AuthContextData = {
  signIn(credentials: ISignIn): Promise<void>;
  changePassword(changePassword: IChangePassword): Promise<void>;
  updateProfile(profile: IProfile): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: IAuthProviderProps) {
  const { errorFeedbackToast, warningFeedbackToast, successFeedbackToast } = useFeedback();
  const router = useRouter();

  const signIn = useCallback(
    async ({ email, password }: ISignIn) => {
      const {
        data: { session, user },
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        errorFeedbackToast('Login', error);
        return;
      }

      if (!session || !user) {
        warningFeedbackToast('Login', 'Usuário não encontrado!');
        return;
      }

      setCookie(undefined, 'csm.token', session.access_token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      successFeedbackToast('Login', 'Login efetuado com sucesso!');
      router.push('/');
    },
    [router, errorFeedbackToast, warningFeedbackToast, successFeedbackToast],
  );

  const logout = useCallback(async () => {
    destroyCookie(undefined, 'csm.token', { path: '/' });
    await supabase.auth.signOut();

    router.push('/login');
  }, [router]);

  const changePassword = useCallback(
    async ({ password }: IChangePassword) => {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        errorFeedbackToast('Alterar Senha', error);
        return;
      }

      if (!data || !data.user) {
        warningFeedbackToast('Alterar Senha', 'Usuário não encontrado!');
        return;
      }

      successFeedbackToast('Alterar Senha', 'Senha alterada com sucesso!');
      await logout();
    },
    [errorFeedbackToast, warningFeedbackToast, successFeedbackToast, logout],
  );

  const updateProfile = useCallback(
    async ({ name, game_type, engine }: IProfile) => {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name,
          gameType: game_type?.id,
          sweepstakeEngine: engine?.id,
        },
      });

      if (error) {
        errorFeedbackToast('Meu Perfil', error);
        return;
      }

      if (!data || !data.user) {
        warningFeedbackToast('Meu Perfil', 'Usuário não encontrado!');
        return;
      }

      successFeedbackToast('Meu Perfil', 'Perfil atualizado com sucesso!');
      router.push('/');
    },
    [router, errorFeedbackToast, warningFeedbackToast, successFeedbackToast],
  );

  const authProviderValue = useMemo(
    () => ({
      signIn,
      changePassword,
      updateProfile,
      logout,
    }),
    [signIn, changePassword, updateProfile, logout],
  );

  return <AuthContext.Provider value={authProviderValue}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
