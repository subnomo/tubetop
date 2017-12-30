import { call, put, select, takeLatest } from 'redux-saga/effects';
import * as querystring from 'querystring';

import { selectYoutubeAPIKey } from 'containers/Settings/selectors';
import request from 'utils/request';
import { AppAction, searchSuccess, searchFailure } from './actions';
import { SEARCH_SONG } from './constants';

export function isYoutubeLink(url: string): boolean {
  const youtubeExps = [
    /https?:\/\/www\.youtube\.com\/watch\?v=([\w-]+)(\&t=\d*m?\d*s?)?/,
    /https?:\/\/youtube\.com\/watch\?v=([\w-]+)(\&t=\d*m?\d*s?)?/,
    /https?:\/\/youtu.be\/([\w-]+)(\?t=\d*m?\d*s?)?/,
    /https?:\/\/youtube.com\/v\/([\w-]+)(\?t=\d*m?\d*s?)?/,
    /https?:\/\/www.youtube.com\/v\/([\w-]+)(\?t=\d*m?\d*s?)?/
  ];

  for (let i = 0; i < youtubeExps.length; i++) {
    if (youtubeExps[i].test(url)) return true;
  }

  return false;
}

export function isYoutubePlaylist(url: string): boolean {
  const youtubePlaylistExp = /https?:\/\/www\.youtube\.com\/playlist\?list=([\w-]+)/;
  return youtubePlaylistExp.test(url);
}

interface SearchParams {
  key: string;
  part: string;
  q?: string;
  type?: string;
  maxResults?: number;
  relatedToVideoId?: string;
  id?: string | string[];
  playlistId?: string | string[];
}

// Search YouTube with given search terms
export function* search(action: AppAction) {
  const api_key: string = yield select(selectYoutubeAPIKey);

  if (isYoutubeLink(action.query)) {
    const qs = action.query.split('?')[1];

    const params: SearchParams = {
      part: 'snippet',
      key: api_key,
      id: querystring.parse(qs).v,
    };

    // Build query and search YouTube
    const query = querystring.stringify(params);
    const requestURL = `https://www.googleapis.com/youtube/v3/videos?${query}`;
    const res = yield call(request, requestURL);

    // Return an array of all video objects
    return res.items;
    } else if (isYoutubePlaylist(action.query)) {
    const qs = action.query.split('?')[1];

    const params: SearchParams = {
      part: 'snippet',
      key: api_key,
      maxResults: 50,
      playlistId: querystring.parse(qs).list,
    };

    const query = querystring.stringify(params);
    const requestURL = `https://www.googleapis.com/youtube/v3/playlistItems?${query}`;
    const res = yield call(request, requestURL);

    return res.items;
    } else {
    const params: SearchParams = {
      part: 'snippet',
      key: api_key,
      q: action.query,
      maxResults: 10,
    };

    const query = querystring.stringify(params);
    const requestURL = `https://www.googleapis.com/youtube/v3/search?${query}`;
    const res = yield call(request, requestURL);

    return res.items;
  }
}

// Search YouTube but also get extra info (video length, etc.)
export function* searchExtra(action: AppAction) {
  const api_key: string = yield select(selectYoutubeAPIKey);

  let items: any[] = [];
  let videoIDs: string[] = [];
  let nonVideoIndices: number[] = [];

  try {
    items = yield call(search, action);
  } catch (err) {
    yield put(searchFailure(err));
    return;
  }

  items.forEach((item: any, index: number) => {
    if (item.id && item.id.kind === 'youtube#video') {
      videoIDs.push(item.id.videoId);
    } else if (item.kind === 'youtube#video') {
      videoIDs.push(item.id);
    } else if (item.kind === 'youtube#playlistItem') {
      item.id = item.snippet.resourceId.videoId;
      videoIDs.push(item.id);
    } else {
      nonVideoIndices.push(index);
    }
  });

  // Remove non videos from the items
  for (let i = nonVideoIndices.length - 1; i >= 0; i--) {
    items.splice(nonVideoIndices[i], 1);
  }

  const params: SearchParams = {
    part: 'contentDetails',
    key: api_key,
    id: videoIDs.join(','),
  };

  // Build query and search YouTube
  const query = querystring.stringify(params);
  const requestURL = `https://www.googleapis.com/youtube/v3/videos?${query}`;
  let res: any;

  try {
    res = yield call(request, requestURL);
  } catch (err) {
    yield put(searchFailure(err));
    return;
  }

  // Add contentDetails to existing items
  res.items.forEach((item: any, index: number) => {
    items[index].contentDetails = item.contentDetails;
  });

  yield put(searchSuccess(items));
}

export default function* rootSaga() {
  yield takeLatest(SEARCH_SONG, searchExtra);
}
