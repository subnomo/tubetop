import * as React from 'react';
import { connect } from 'react-redux';
import * as querystring from 'querystring';
import { debounce } from 'lodash';
import * as ulid from 'ulid';
import * as Autosuggest from 'react-autosuggest';
import * as match from 'autosuggest-highlight/match';
import * as parse from 'autosuggest-highlight/parse';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';

import { SearchBox, SearchInput, AutosuggestWrapper } from './styles';
import { isYoutubeLink, isYoutubePlayList } from './util';
import { AppAction, addSong } from '../../containers/App/actions';
import { SongData } from '../Song';

interface SearchParams {
  key: string;
  part: string;
  q?: string;
  type?: string;
  maxResults?: number;
  relatedToVideoId?: string;
  id?: string;
  playlistId?: string;
}

// Search YouTube with given search terms
async function search(searchTerm: string, part = 'snippet'): Promise<any[]> {
  if (isYoutubeLink(searchTerm)) {
    const qs = searchTerm.split('?')[1];

    const params: SearchParams = {
      part,
      key: process.env.YOUTUBE_API_KEY,
      id: querystring.parse(qs).v,
    };

    // Build query and search YouTube
    const query = querystring.stringify(params);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${query}`);
    const data: any = await res.json();

    // Return an array of all video objects
    return data.items;
  } else if (isYoutubePlayList(searchTerm)) {
    const qs = searchTerm.split('?')[1];

    const params: SearchParams = {
      part,
      key: process.env.YOUTUBE_API_KEY,
      maxResults: 50,
      playlistId: querystring.parse(qs).list,
    };

    // Build query and search YouTube
    const query = querystring.stringify(params);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?${query}`);
    const data: any = await res.json();

    // Return an array of all video objects
    return data.items;
  } else {
    const params: SearchParams = {
      part,
      key: process.env.YOUTUBE_API_KEY,
      q: searchTerm,
      maxResults: 10,
    };

    // Build query and search YouTube
    const query = querystring.stringify(params);
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${query}`);
    const data: any = await res.json();

    // Return an array of all video objects
    return data.items;
  }
}

// Search YouTube but also get extra info (video length, etc.)
async function searchExtra(searchTerm: string): Promise<any[]> {
  let items = await search(searchTerm);
  let videoIDs: string[] = [];
  let nonVideoIndices: number[] = [];

  items.forEach((item: any, index: number) => {
    if (item.id.kind === 'youtube#video') {
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
    key: process.env.YOUTUBE_API_KEY,
    id: videoIDs.join(','),
  };

  // Build query and search YouTube
  const query = querystring.stringify(params);
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${query}`);
  const data: any = await res.json();

  // Add contentDetails to existing items
  data.items.forEach((item: any, index: number) => {
    items[index].contentDetails = item.contentDetails;
  });

  return items;
}

// Convert ISO 8601 duration to seconds
function parseDuration(duration: string): number {
  let seconds = 0;

  let number = '';
  let onNumber = false;

  for (let i = 0; i < duration.length; i++) {
    const c = duration[i];

    // If the character is a number, parse piece of duration
    if (!isNaN(parseInt(c))) {
      number += c;
      onNumber = true;
    } else if (onNumber) {
      // If we moved off a number, parse that portion
      const num = parseInt(number);

      switch (c) {
        case 'H':
          seconds += num * 3600;
          break;
        case 'M':
          seconds += num * 60;
          break;
        case 'S':
          seconds += num;
          break;
      }

      number = '';
      onNumber = false;
    }
  }

  return seconds;
}

// react-autosuggest
function getSuggestionValue(suggestion: any): string {
  return suggestion.snippet.title;
}

async function getSuggestions(value: string): Promise<any[]> {
  const inputValue = value.trim();

  if (inputValue.length === 0) return [];
  return await searchExtra(inputValue);
}

// Component Class

interface IProps extends React.Props<Search> {
  dispatch: (action: AppAction) => void;
}

interface IState {
  value: string;
  suggestions: any[];
}

export class Search extends React.PureComponent<IProps, IState> {
  private debouncedHSFR: (value: string) => void;

  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };

    this.debouncedHSFR = debounce(async (value: string) => {
      // Perform search and save results to state
      this.setState({
        suggestions: await getSuggestions(value),
      });
    }, 300);
  }

  handleChange = (e: any, { newValue }: any) => {
    this.setState({
      value: newValue,
    });
  }

  handleKeyPress = (e: any) => {
    // On 'Enter', add all suggestions to queue
    if (e.key === 'Enter') {
      this.state.suggestions.forEach((suggestion, i) => {
        this.handleSuggestionSelected(null, { suggestion });
      });
    }
  }

  handleSuggestionsFetchRequested = ({ value }: { value: string }) => {
    // Debounce search so as to only send requests when user stops typing
    this.debouncedHSFR(value);
  }

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  handleSuggestionSelected = (e: any, opts: any) => {
    const { suggestion } = opts;

    const song: SongData = {
      key: ulid(),
      id: suggestion.id.videoId || suggestion.id,
      title: suggestion.snippet.title,
      thumb: suggestion.snippet.thumbnails.default.url,
      duration: parseDuration(suggestion.contentDetails.duration),
      playing: false,
    };

    this.props.dispatch(addSong(song));
  }

  renderInput = (inputProps: any) => {
    const { ref, ...other } = inputProps;

    return (
      <SearchBox>
        <div className="searchIcon">
          <SearchIcon />
        </div>

        <SearchInput
          inputRef={ref}
          InputProps={other}
        />
      </SearchBox>
    );
  }

  renderSuggestion = (suggestion: any, opts: { query: string, isHighlighted: boolean }) => {
    const label: string = getSuggestionValue(suggestion);

    const matches: any = match(label, opts.query);
    const parts: any = parse(label, matches);

    return (
      <MenuItem selected={opts.isHighlighted} component="div">
        <div>
          {parts.map((part: any, i: number) => {
            return part.highlight ? (
              <span key={i} style={{ fontWeight: 300 }}>
                {part.text}
              </span>
            ) : (
              <strong key={i} style={{ fontWeight: 500 }}>
                {part.text}
              </strong>
            );
          })}
        </div>
      </MenuItem>
    );
  }

  renderSuggestionsContainer = (opts: { containerProps: any, children: any }) => {
    const { containerProps, children } = opts;
    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  }

  render() {
    let { value, suggestions } = this.state;

    return (
      <AutosuggestWrapper>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.handleSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          renderSuggestion={this.renderSuggestion}
          renderInputComponent={this.renderInput}
          inputProps={{
            placeholder: 'Search...',
            value,
            onChange: this.handleChange,
            onKeyPress: this.handleKeyPress,
            disableUnderline: true,
          }}
        />
      </AutosuggestWrapper>
    );
  }
}

export default connect()(Search as any);
