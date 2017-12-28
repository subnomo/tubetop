import * as React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import { ulid } from 'ulid';
import * as Autosuggest from 'react-autosuggest';
import * as match from 'autosuggest-highlight/match';
import * as parse from 'autosuggest-highlight/parse';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import SearchIcon from 'material-ui-icons/Search';

import { SearchBox, SearchInput, AutosuggestWrapper } from './styles';
import { parseDuration } from './util';
import { AppAction, addSong, addSongs, searchSong } from 'containers/App/actions';
import { selectSearchResults } from 'containers/App/selectors';
import { SongData } from 'components/Song';

interface IProps extends React.Props<Search> {
  dispatch: (action: AppAction) => void;
  searchResults: any[];
}

interface IState {
  value: string;
  suggestions: any[];
}

export class Search extends React.PureComponent<IProps, IState> {
  private debouncedHSFR: (value: string) => void;

  constructor(props: IProps) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
    };

    this.debouncedHSFR = debounce(this.getSuggestions, 300);
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.setState({
      suggestions: nextProps.searchResults,
    });
  }

  handleChange = (e: any, { newValue }: any) => {
    this.setState({
      value: newValue,
    });
  }

  handleKeyPress = (e: any) => {
    // On 'Enter', add all suggestions to queue
    if (e.key === 'Enter') {
      const songs = this.state.suggestions.map((suggestion) => {
        return this.handleSuggestionSelected(null, { suggestion }, false);
      });

      this.props.dispatch(addSongs(songs));
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

  handleSuggestionSelected = (e: any, opts: any, dispatch = true) => {
    const { suggestion } = opts;

    const song: SongData = {
      key: ulid(),
      id: suggestion.id.videoId || suggestion.id,
      title: suggestion.snippet.title,
      thumb: suggestion.snippet.thumbnails.medium.url,
      duration: parseDuration(suggestion.contentDetails.duration),
      playing: false,
    };

    if (dispatch) this.props.dispatch(addSong(song));

    return song;
  }

  getSuggestionValue = (suggestion: any): string => {
    return suggestion.snippet.title;
  }

  getSuggestions = (value: string) => {
    const inputValue = value.trim();
    if (inputValue.length === 0) return;
    this.props.dispatch(searchSong(inputValue));
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
    const label: string = this.getSuggestionValue(suggestion);

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
      <Paper {...containerProps}>
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
          getSuggestionValue={this.getSuggestionValue}
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

function mapStateToProps(state: any) {
  return {
    searchResults: selectSearchResults(state),
  };
}

export default connect(mapStateToProps)(Search as any);
