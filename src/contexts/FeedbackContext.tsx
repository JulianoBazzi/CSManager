/** biome-ignore-all lint/suspicious/noExplicitAny: <ignore> */

import type { AuthError } from '@supabase/supabase-js';
import { type Context, createContext, type ReactNode, useContext } from 'react';

import { toaster } from '~/components/Toaster';

type ToastType = 'info' | 'warning' | 'success' | 'error';

interface IFeedbackProviderProps {
  children: ReactNode;
}

type FeedbackContextData = {
  errorFeedbackToast: (title: string, error: any) => void;
  infoFeedbackToast: (title: string, description?: string) => void;
  warningFeedbackToast: (title: string, description?: string) => void;
  successFeedbackToast: (title: string, description?: string) => void;
  dangerFeedbackToast: (title: string, description?: string) => void;
};

const FeedbackContext = createContext({} as FeedbackContextData);

export function FeedbackProvider({ children }: IFeedbackProviderProps) {
  function genericFeedbackToast(title: string, description?: string, type?: ToastType) {
    toaster.create({
      title,
      description,
      type,
      duration: 8000,
      closable: true,
    });
  }

  function infoFeedbackToast(title: string, description?: string) {
    genericFeedbackToast(title, description, 'info');
  }

  function warningFeedbackToast(title: string, description?: string) {
    genericFeedbackToast(title, description, 'warning');
  }

  function successFeedbackToast(title: string, description?: string) {
    genericFeedbackToast(title, description, 'success');
  }

  function dangerFeedbackToast(title: string, description?: string) {
    genericFeedbackToast(title, description, 'error');
  }

  function errorFeedbackToast(title: string, error: any): void {
    if (error as AuthError) {
      warningFeedbackToast(title, `${error.message}`);
    } else if (error?.message) {
      dangerFeedbackToast(title, `Ocorreu um erro: ${error.message}`);
    } else {
      dangerFeedbackToast(title, `Ocorreu um erro: ${error}`);
    }
  }

  return (
    <FeedbackContext.Provider
      value={{
        errorFeedbackToast,
        infoFeedbackToast,
        warningFeedbackToast,
        successFeedbackToast,
        dangerFeedbackToast,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  return useContext(FeedbackContext as Context<FeedbackContextData>);
}
