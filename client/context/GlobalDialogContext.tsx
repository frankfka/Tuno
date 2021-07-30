import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ApiAward } from '../../types/Award';
import LoginDialog from '../components/Login/LoginDialog';

const emptyFn = () => {};

type LoginDialogData = {
  onLoginCompleted?(): void;
};

type DialogContextState = {
  loginDialogData?: LoginDialogData;
  awardInfoDialogData?: ApiAward;
  // Exposed methods
  setLoginDialogData(data: LoginDialogData): void;
  setAwardInfoDialogData(award?: ApiAward): void;
};

export const DialogContext = createContext<DialogContextState>({
  setLoginDialogData: emptyFn,
  setAwardInfoDialogData: emptyFn,
});

export const DialogContextProvider: React.FC = ({ children }) => {
  const [loginDialogData, setLoginDialogData] = useState<LoginDialogData>();
  const [awardInfoDialogData, setAwardInfoDialogData] = useState<ApiAward>();

  const dialogContextState: DialogContextState = {
    loginDialogData,
    awardInfoDialogData,
    setLoginDialogData,
    setAwardInfoDialogData,
  };

  return (
    <DialogContext.Provider value={dialogContextState}>
      {/*Login Dialog*/}
      <LoginDialog
        isOpen={loginDialogData != null}
        setIsOpen={() => setLoginDialogData(undefined)}
        onLoginCompleted={loginDialogData?.onLoginCompleted}
      />

      {children}
    </DialogContext.Provider>
  );
};
