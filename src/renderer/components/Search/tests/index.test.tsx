import * as React from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { fromJS } from 'immutable';
import * as Autosuggest from 'react-autosuggest';

import { Search, mapStateToProps } from '..';
import { parseDuration } from '../util';
import { addSongs, searchSong } from 'containers/App/actions';
import { SongData } from 'components/Song';

jest.mock('uuid', () => ({ v4: jest.fn(() => 'test_uuid') }));

describe('<Search />', () => {
  let dispatch: jest.Mock<{}>;
  let searchResults: any[];
  let searchComponent: ReactWrapper<any, any>;

  beforeEach(() => {
    dispatch = jest.fn();
    searchResults = [
      {
        id: {
          kind: 'youtube#video',
        },

        snippet: {
          title: 'Test Video Title',
          thumbnails: {
            medium: {
              url: 'http://example.com/example.jpg',
            },
          },
        },

        contentDetails: {
          duration: 'PT2H45M23S',
        },
      },
    ];

    searchComponent = mount(
      <Search dispatch={dispatch} searchResults={searchResults} />
    );
  });

  it('should render the search input', () => {
    expect(searchComponent.find('input').prop('placeholder')).toBe('Search...');
  });

  it('should update the suggestions when new search results come in', () => {
    expect(searchComponent.state()).toEqual({
      value: '',
      suggestions: searchResults,
    });

    const newResults = [
      {
        title: 'Boom!',
      },
    ];

    searchComponent.setProps({
      searchResults: newResults,
    });

    expect(searchComponent.state()).toEqual({
      value: '',
      suggestions: newResults,
    });
  });

  it('should update the state when the input value is changed', () => {
    const newValue = 'test search value';

    searchComponent.find('input').simulate('change', {
      target: {
        value: newValue,
      },
    });

    expect(searchComponent.state()).toEqual({
      value: newValue,
      suggestions: searchResults,
    });
  });

  it('should dispatch addSongs when enter key is pressed', () => {
    const songs = searchResults.map((suggestion) => {
      return (searchComponent.instance() as Search)
        .handleSuggestionSelected(null, { suggestion }, false);
    });

    const input = searchComponent.find('input');
    input.simulate('keypress', {
      key: 'Escape',
    });

    expect(dispatch).not.toHaveBeenCalled();

    input.simulate('keypress', {
      key: 'Enter',
    });

    expect(dispatch).toHaveBeenCalledWith(addSongs(songs));
  });

  describe('<Search /> methods', () => {
    let instance: Search;

    beforeEach(() => {
      instance = searchComponent.instance() as Search;
    });

    describe('handleSuggestionsClearRequested', () => {
      it('should clear suggestions', () => {
        instance.handleSuggestionsClearRequested();
        expect(instance.state.suggestions).toEqual([]);
      });
    });

    describe('handleSuggestionSelected', () => {
      it('should convert a suggestion into a song of type SongData', () => {
        const suggestion: any = searchResults[0];

        const expectedResult: SongData = {
          key: 'test_uuid',
          id: suggestion.id.videoId || suggestion.id,
          title: suggestion.snippet.title,
          thumb: suggestion.snippet.thumbnails.medium.url,
          duration: parseDuration(suggestion.contentDetails.duration),
          playing: false,
        };

        const song = instance.handleSuggestionSelected({}, { suggestion });
        expect(song).toEqual(expectedResult);
      });

      it('should not dispatch addSong if dispatch parameter is false', () => {
        instance.handleSuggestionSelected({}, { suggestion: searchResults[0] }, false);
        expect(dispatch).not.toHaveBeenCalled();
      });
    });

    describe('getSuggestionValue', () => {
      it('should take a suggestion and return the title', () => {
        const expectedResult: string = searchResults[0].snippet.title;
        const result = instance.getSuggestionValue(searchResults[0]);
        expect(result).toBe(expectedResult);
      });
    });

    describe('getSuggestions', () => {
      it('should dispatch searchSong with input', () => {
        instance.getSuggestions(' abc ');
        expect(dispatch).toHaveBeenLastCalledWith(searchSong('abc'));
      });

      it('should not dispatch searchSong given blank input', () => {
        instance.getSuggestions(' ');
        expect(dispatch).not.toHaveBeenCalled();
      });
    });

    describe('renderSuggestion', () => {
      it('should render the passed suggestion', () => {
        const result = instance.renderSuggestion(searchResults[0], {
          query: 'abc',
          isHighlighted: true,
        });

        const expectedResult = (
          <strong key={0} style={{ fontWeight: 500 }}>
            {searchResults[0].snippet.title}
          </strong>
        );

        expect(shallow(result).contains(expectedResult)).toBe(true);
      });

      it('should highlight matching suggestions', () => {
        const title = searchResults[0].snippet.title;

        const result = instance.renderSuggestion(searchResults[0], {
          query: title,
          isHighlighted: true,
        });

        const expectedResult = (
          <span key={0} style={{ fontWeight: 300 }}>
            {title.split(' ')[0]}
          </span>
        );

        expect(shallow(result).contains(expectedResult)).toBe(true);
      });
    });
  });
});

describe('mapStateToProps', () => {
  it('should take the state and return an object containing search results', () => {
    const searchResults: any[] = [
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

    const mockedState = fromJS({
      global: {
        search: {
          results: searchResults,
        },
      },
    });

    expect(mapStateToProps(mockedState).searchResults).toEqual(searchResults);
  });
});
