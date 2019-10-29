import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Player = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  height: 80px;
  padding: 0 24px;
  background-color: #26262666;
`;

export const Controls = styled.div`
  flex-grow: 1;
  margin: 0 ${rem(20)};
  display: flex;
//   flex-direction: column;
  justify-content: center;
  align-items: center;
`;