import { MimeType, mimeTypes } from 'file-type';
import FileType from 'file-type/browser';
import ReactPlayer from 'react-player';
import PostContent from '../types/PostContent';
import PostContentSource from '../types/PostContentSource';
import PostContentType from '../types/PostContentType';
import getCidGatewayUrl from './getCidGatewayUrl';

export type LinkContentInfo = Omit<PostContent, 'title'>;

/*
Link Type Checkers
 */

const isHttpLink = (link: string): boolean => {
  return link.startsWith('http') || link.startsWith('https');
};

const isIpfsCid = (link: string): boolean => {
  const isV0Cid = link.startsWith('Qm');
  const isV1Cid = link.startsWith('b');

  return isV0Cid || isV1Cid;
};

/*
Parsers
 */

// Attempts to fetch data in case this is a direct link to an image / video / audio
const getMimeType = async (link: string): Promise<MimeType | undefined> => {
  try {
    const response = await fetch(link);
    if (response.body == null) {
      return;
    }

    const fileType = await FileType.fromBlob(await response.blob());
    if (fileType == null) {
      return;
    }

    return fileType.mime;
  } catch (err) {
    console.error('Error getting mime type', err);
    return;
  }
};

const isAudioVisualMimeType = (mimeType: MimeType): boolean => {
  return mimeType.startsWith('audio') || mimeType.startsWith('video');
};

const isImageMimeType = (mimeType: MimeType): boolean => {
  return mimeType.startsWith('image');
};

// Traditional HTTP
const getLinkContentInfoFromHttp = async (
  link: string
): Promise<LinkContentInfo> => {
  let contentType: PostContentType = 'other';

  if (ReactPlayer.canPlay(link)) {
    contentType = 'av';
  } else {
    const mimeType = await getMimeType(link);
    if (mimeType && isImageMimeType(mimeType)) {
      contentType = 'img';
    }
  }

  return {
    contentType,
    source: {
      type: 'url',
      value: link,
    },
  };
};

// CID
const getLinkContentInfoFromCid = async (
  cid: string
): Promise<LinkContentInfo> => {
  const gatewayUrl = getCidGatewayUrl(cid);
  // TODO: Check size

  const mimeType = await getMimeType(gatewayUrl);
  let contentType: PostContentType = 'other';

  if (mimeType) {
    if (isAudioVisualMimeType(mimeType)) {
      contentType = 'av';
    } else if (isImageMimeType(mimeType)) {
      contentType = 'img';
    }
  }

  return {
    contentType,
    source: {
      type: 'ipfs',
      value: cid,
    },
  };
};

const getLinkContentInfo = async (
  link: string
): Promise<LinkContentInfo | undefined> => {
  const cleanedLink = link.trim();
  if (!cleanedLink) {
    return;
  }

  // HTTP links
  if (isHttpLink(cleanedLink)) {
    return getLinkContentInfoFromHttp(cleanedLink);
  }

  // IPFS hashes
  const possibleCid = cleanedLink.replace('ipfs://', '');
  if (isIpfsCid(possibleCid)) {
    return getLinkContentInfoFromCid(possibleCid);
  }
};

export default getLinkContentInfo;
