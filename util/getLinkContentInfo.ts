import { post } from '@magic-sdk/admin/dist/utils/rest';
import { split } from 'lodash';
import { MimeType, mimeTypes } from 'file-type';
import Resolution from '@unstoppabledomains/resolution';
import FileType from 'file-type/browser';
import ReactPlayer from 'react-player';
import PostContent from '../types/PostContent';
import PostContentSource from '../types/PostContentSource';
import PostContentType from '../types/PostContentType';
import { getCid, getCidGatewayUrl } from './cidUtils';

export type LinkContentInfo = Omit<PostContent, 'title'>;

/*
Link Type Checkers
 */

const unstoppableDomainResolver = new Resolution();

const UNSTOPPABLE_DOMAINS = ['.crypto', '.zil'];

// the domain itself and an optional tail, which defaults to empty
type UnstoppableDomain = [string, string];
const getUnstoppableDomain = (link: string): UnstoppableDomain | undefined => {
  const matchingDomains = UNSTOPPABLE_DOMAINS.filter((d) => link.includes(d));

  if (matchingDomains.length === 1) {
    const match = matchingDomains[0];
    const splitLinkContents = split(link, match);

    // We should have <= 2 items - the actual domain (without extension) and an optional tail
    if (splitLinkContents.length > 2) {
      return;
    }

    return [
      splitLinkContents[0] + match,
      splitLinkContents.length > 1 ? splitLinkContents[1] : '',
    ];
  }
};

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

// Unstoppable domain
const getLinkContentInfoFromUnstoppableDomain = async (
  unstoppableDomain: UnstoppableDomain
): Promise<LinkContentInfo | undefined> => {
  const [domain, postfix] = unstoppableDomain;
  try {
    const resolvedCid = await unstoppableDomainResolver.ipfsHash(domain);
    return getLinkContentInfoFromCid(resolvedCid + postfix);
  } catch (err) {
    console.error('Error resolving unstoppable domain', domain, postfix, err);
  }
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
  const possibleCid = getCid(cleanedLink);
  if (isIpfsCid(possibleCid)) {
    return getLinkContentInfoFromCid(possibleCid);
  }

  // Unstoppable domain
  const unstoppableDomainParseResult = getUnstoppableDomain(cleanedLink);
  if (unstoppableDomainParseResult != null) {
    return getLinkContentInfoFromUnstoppableDomain(
      unstoppableDomainParseResult
    );
  }
};

export default getLinkContentInfo;
