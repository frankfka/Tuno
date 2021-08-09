import React from 'react';

import { Tab, Tabs } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import SubjectIcon from '@material-ui/icons/Subject';
import PublishIcon from '@material-ui/icons/Publish';

export type ContentTypeTabName = 'Link' | 'Text' | 'Upload';

const CONTENT_TYPE_TABS: ReadonlyArray<
  readonly [ContentTypeTabName, React.ReactElement]
> = [
  ['Link', <LinkIcon />],
  ['Text', <SubjectIcon />],
  ['Upload', <PublishIcon />],
] as const;

type Props = {
  selectedTab: ContentTypeTabName;
  onTabSelect(tab: ContentTypeTabName): void;
};

const CreatePostFormContentTypeTabs: React.FC<Props> = ({
  selectedTab,
  onTabSelect,
}) => {
  return (
    <Tabs
      variant="fullWidth"
      value={CONTENT_TYPE_TABS.findIndex((t) => t[0] === selectedTab)}
      onChange={(e, v) => {
        onTabSelect(CONTENT_TYPE_TABS[v][0]);
      }}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      {CONTENT_TYPE_TABS.map(([label, icon], index) => (
        <Tab
          key={index}
          value={index}
          label={label}
          icon={icon}
          disableRipple
          disableTouchRipple
        />
      ))}
    </Tabs>
  );
};

export default CreatePostFormContentTypeTabs;
