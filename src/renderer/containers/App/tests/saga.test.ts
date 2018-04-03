import { put, takeLatest, SelectEffect, CallEffect, PutEffect } from 'redux-saga/effects';
import { cloneableGenerator, SagaIteratorClone } from 'redux-saga/utils';

import { AppAction, searchSuccess, searchFailure } from '../actions';
import { SEARCH_SONG } from '../constants';
import rootSaga, { isYoutubeLink, isYoutubePlaylist, search, searchExtra } from '../saga';

describe('isYoutubeLink', () => {
  it('should check if the given url matches a YouTube video', () => {
    expect(isYoutubeLink('https://www.youtube.com')).toBe(false);
    expect(isYoutubeLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    expect(isYoutubeLink('https://www.youtube.com/playlist?list=PLBCF2DAC6FFB574DE')).toBe(false);
  });
});

describe('isYoutubePlaylist', () => {
  it('should check if the given url matches a YouTube playlist', () => {
    expect(isYoutubePlaylist('https://www.youtube.com')).toBe(false);
    expect(isYoutubePlaylist('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(false);
    expect(isYoutubePlaylist('https://www.youtube.com/playlist?list=PLBCF2DAC6FFB574DE'))
      .toBe(true);
  });
});

const api_key = 'API_KEY';

describe('search Saga', () => {
  it('should return the results of the YouTube search', () => {
    const action = {
      type: SEARCH_SONG,
      query: 'abc',
    };

    const searchGenerator = cloneableGenerator(search)(action);

    function test() {
      const clone = searchGenerator.clone();

      const selectDescriptor = clone.next().value;
      expect(selectDescriptor).toMatchSnapshot();

      const callDescriptor = clone.next(api_key).value;
      expect(callDescriptor).toMatchSnapshot();

      // Returns
      const res = {
        items: [
          {
            snippet: {
              title: 'one',
            },
          },

          {
            snippet: {
              title: 'two',
            },
          },

          {
            snippet: {
              title: 'Deleted video',
            },
          },
        ],
      };

      const returnVal = clone.next(res).value;
      expect(returnVal).toEqual(res.items.slice(0, res.items.length - 1));
    }

    test();
    action.query = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    test();
    action.query = 'https://www.youtube.com/playlist?list=PLBCF2DAC6FFB574DE';
    test();
  });
});

describe('searchExtra Saga', () => {
  let searchExtraGenerator: SagaIteratorClone;

  beforeEach(() => {
    searchExtraGenerator = cloneableGenerator(searchExtra)({
      type: SEARCH_SONG,
      query: 'abc',
    });

    const selectDescriptor = searchExtraGenerator.next().value;
    expect(selectDescriptor).toMatchSnapshot();

    const callDescriptor = searchExtraGenerator.next(api_key).value;
    expect(callDescriptor).toMatchSnapshot();
  });

  it('should dispatch the searchSuccess action if it requests the data successfully', () => {
    const items: any[] = [
      {
        id: {
          kind: 'youtube#video',
        },
      },

      {
        kind: 'youtube#video',
      },

      {
        kind: 'youtube#playlistItem',
        snippet: {
          resourceId: {
            videoId: 'abc',
          },
        },
      },

      {},
    ];

    const callDescriptor2 = searchExtraGenerator.next(items).value;
    expect(callDescriptor2).toMatchSnapshot();

    const putDescriptor = searchExtraGenerator.next({ items }).value;
    expect(putDescriptor).toEqual(put(searchSuccess(items)));
  });

  it('should dispatch the searchFailure action if a response errors', () => {
    const items = [];
    const clone = searchExtraGenerator.clone();

    const response = new Error('Some error');
    const putDescriptor = clone.throw(response).value;
    expect(putDescriptor).toEqual(put(searchFailure(response)));

    // Returns
    clone.next();

    const callDescriptor2 = searchExtraGenerator.next(items).value;
    expect(callDescriptor2).toMatchSnapshot();

    const putDescriptor2 = searchExtraGenerator.throw(response).value;
    expect(putDescriptor2).toEqual(put(searchFailure(response)));

    // Returns
    searchExtraGenerator.next();
  });
});

describe('rootSaga Saga', () => {
  const rootSagaGenerator = rootSaga();

  it('should start task to watch for SEARCH_SONG action', () => {
    const takeLatestDescriptor = rootSagaGenerator.next().value;
    expect(takeLatestDescriptor).toEqual(takeLatest(SEARCH_SONG, searchExtra));
  });
});
