import { useContext } from 'react';
import { DialogContext } from '../context/GlobalDialog/GlobalDialogContext';

const useGlobalDialog = () => {
  return useContext(DialogContext);
};

export default useGlobalDialog;
