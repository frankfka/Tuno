import React, { createContext, useCallback, useEffect, useState } from 'react';
import AwardInfoDialog from '../../components/AwardInfoDialog/AwardInfoDialog';
import InfoDialog from '../../components/InfoDialog/InfoDialog';
import LoginDialog from '../../components/LoginDialog/LoginDialog';
import {
  AwardInfoDialogData,
  InfoDialogData,
  LoginDialogData,
} from './GlobalDialogDataTypes';

const emptyFn = () => {};

type DialogContextState = {
  loginDialogData?: LoginDialogData;
  infoDialogData?: InfoDialogData;
  awardInfoDialogData?: AwardInfoDialogData;
  // Exposed methods
  setLoginDialogData(data?: LoginDialogData): void;
  setInfoDialogData(data?: InfoDialogData): void;
  setAwardInfoDialogData(data?: AwardInfoDialogData): void;
};

export const DialogContext = createContext<DialogContextState>({
  setLoginDialogData: emptyFn,
  setInfoDialogData: emptyFn,
  setAwardInfoDialogData: emptyFn,
});

export const DialogContextProvider: React.FC = ({ children }) => {
  const [loginDialogData, setLoginDialogData] = useState<LoginDialogData>();
  const [infoDialogData, setInfoDialogData] = useState<InfoDialogData>();
  const [awardInfoDialogData, setAwardInfoDialogData] =
    useState<AwardInfoDialogData>();

  const dialogContextState: DialogContextState = {
    loginDialogData,
    infoDialogData,
    awardInfoDialogData,
    setLoginDialogData,
    setInfoDialogData,
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

      {/*Generic Info Dialog*/}
      <InfoDialog
        title={infoDialogData?.title}
        content={infoDialogData?.content}
        isOpen={infoDialogData != null}
        closeDialog={() => setInfoDialogData(undefined)}
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
