import styled from 'styled-components';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import FormControl from 'material-ui/Form/FormControl';
import { Link } from 'react-router-dom';

// Styled components

export const Root = styled.div`
  width: 100%;
`;

export const MenuButton = styled(IconButton)`
  margin-left: -4px;
  margin-right: 20px;
`;

export const FlexTypo = styled(Typography)`
  flex: 1;
`;

export const SearchBox = styled(FormControl)`
  border-radius: 2px;
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.15);
  transition: background 100ms linear;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  > * {
    color: inherit !important;
  }

  input {
    width: 150px;
    transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding: 10px 10px 10px 72px;

    &:focus {
      width: 225px;
    }

    &::selection {
      color: inherit;
    }
  }

  .searchIcon {
    position: absolute;
    width: 72px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }
`;

export const HomeLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;
