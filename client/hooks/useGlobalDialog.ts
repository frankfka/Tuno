import { useContext } from 'react';
import { DialogContext } from '../context/GlobalDialogContext';

const useGlobalDialog = () => {
  return useContext(DialogContext);
};

export default useGlobalDialog;
