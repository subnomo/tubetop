import styled from 'styled-components';
import TextField from 'material-ui/TextField';

const iconWidth = 72;

export const SearchBox = styled.div`
  position: relative;
  border-radius: 2px;
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.15);
  transition: background 100ms linear;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  .searchIcon {
    position: absolute;
    width: ${iconWidth}px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
`;

const padding = 10;
const width = 500;

export const SearchInput = styled(TextField)`
  input {
    color: #fff;
    width: 150px;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding: ${padding}px ${padding}px ${padding}px ${iconWidth}px;

    &:focus {
      width: ${width}px;
    }

    &::selection {
      color: #fff;
    }
  }
`;

export const AutosuggestWrapper = styled.div`
  .react-autosuggest__container {
    flex-grow: 1;
    position: relative;
  }

  .react-autosuggest__suggestions-container--open {
    position: absolute;
    z-index: 1;
  }

  .react-autosuggest__suggestions-list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .react-autosuggest__suggestion {
    display: block;
    width: ${width + iconWidth + padding}px;

    div {
      // Ellipsis
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
