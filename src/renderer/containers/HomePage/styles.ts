import styled from 'styled-components';

export const HomeContainer = styled.div`
  height: 100%;
`;

export const PlaceholderContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;

  svg {
    width: 72px;
    height: 72px;
    margin-bottom: 10px;
  }

  color: #4f4f4f;
`;
