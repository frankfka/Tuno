import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

type Props = {
  title?: string;
  content: React.ReactNode;
  isOpen: boolean;
  closeDialog(): void;
};

const InfoDialog: React.FC<Props> = ({
  title,
  content,
  isOpen,
  closeDialog,
}) => {
  return (
    <Dialog open={isOpen} onClose={closeDialog} fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
