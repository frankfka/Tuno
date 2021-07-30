import React, { createContext, useCallback, useEffect, useState } from 'react';
import { ApiAward } from '../../types/Award';
import AwardInfoDialog from '../components/AwardInfoDialog/AwardInfoDialog';
import LoginDialog from '../components/LoginDialog/LoginDialog';

const emptyFn = () => {};

type LoginDialogData = {
  onLoginCompleted?(): void;
};

type AwardInfoDialogData = {
  id: string;
};

type DialogContextState = {
  loginDialogData?: LoginDialogData;
  awardInfoDialogData?: AwardInfoDialogData;
  // Exposed methods
  setLoginDialogData(data?: LoginDialogData): void;
  setAwardInfoDialogData(data?: AwardInfoDialogData): void;
};

export const DialogContext = createContext<DialogContextState>({
  setLoginDialogData: emptyFn,
  setAwardInfoDialogData: emptyFn,
});

export const DialogContextProvider: React.FC = ({ children }) => {
  const [loginDialogData, setLoginDialogData] = useState<LoginDialogData>();
  const [awardInfoDialogData, setAwardInfoDialogData] =
    useState<AwardInfoDialogData>();

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
        closeDialog={() => setLoginDialogData(undefined)}
        onLoginCompleted={loginDialogData?.onLoginCompleted}
      />

      {/*Award Dialog*/}
      <AwardInfoDialog
        awardId={awardInfoDialogData?.id ?? ''}
        isOpen={awardInfoDialogData != null}
        closeDialog={() => setAwardInfoDialogData(undefined)}
      />
      {children}
    </DialogContext.Provider>
  );
};
