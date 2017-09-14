import * as React from 'react';
import * as querystring from 'querystring';
import * as _ from 'lodash';
import * as Autosuggest from 'react-autosuggest';
import * as match from 'autosuggest-highlight/match';
import * as parse from 'autosuggest-highlight/parse';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';
import { SearchBox, SearchInput, AutosuggestWrapper } from './styles';

interface SearchParams {
  key: string;
  part: string;
  q?: string;
  type?: string;
  maxResults?: number;
  relatedToVideoId?: string;
}

// Search YouTube with given search terms
async function search(searchTerm: string): Promise<any[]> {
  const params: SearchParams = {
    part: 'snippet',
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

// react-autosuggest
function getSuggestionValue(suggestion: any): string {
  return suggestion.snippet.title;
}

async function getSuggestions(value: string): Promise<any[]> {
  const inputValue = value.trim().toLowerCase();

  if (inputValue.length === 0) return [];
  return await search(inputValue);
}

// Component Class

interface IState {
  value: string;
  suggestions: any[];
}

export default class Search extends React.PureComponent<{}, IState> {
  private debouncedHSFR: (value: string) => void;

  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };

    this.debouncedHSFR = _.debounce(async (value: string) => {
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

    // TODO: Dispatch song to Redux store
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
      <div>

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
              disableUnderline: true,
            }}
          />
        </AutosuggestWrapper>
      </div>
    );
  }
}
