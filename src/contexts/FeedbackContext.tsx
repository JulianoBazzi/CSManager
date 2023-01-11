import { Context, createContext, ReactNode, useContext } from 'react';

import { AlertStatus, useToast } from '@chakra-ui/react';
import { AuthError } from '@supabase/supabase-js';

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
  const toast = useToast();

  function errorFeedbackToast(title: string, error: any): void {
    if (error as AuthError) {
      warningFeedbackToast(title, `${error.message}`);
    } else if (error?.message) {
      dangerFeedbackToast(title, `Ocorreu um erro: ${error.message}`);
    } else {
      dangerFeedbackToast(title, `Ocorreu um erro: ${error}`);
    }
  }

  function genericFeedbackToast(title: string, description?: string, status?: AlertStatus) {
    toast({
      title,
      description,
      status,
      position: 'top',
      duration: 8000,
      isClosable: true,
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

  return (
    <FeedbackContext.Provider
      value={{ errorFeedbackToast, infoFeedbackToast, warningFeedbackToast, successFeedbackToast, dangerFeedbackToast }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  return useContext(FeedbackContext as Context<FeedbackContextData>);
}
