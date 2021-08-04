import React from 'react';

export type InfoDialogData = {
  title?: string;
  content: React.ReactNode;
};

export type LoginDialogData = {
  onLoginCompleted?(): void;
};

export type AwardInfoDialogData = {
  id: string;
};
