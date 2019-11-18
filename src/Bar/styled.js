import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';
import {Progress} from "./Progress/styled";

export const Player = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  // top: 0;
  padding-top: ${rem(11)};;
  // padding: 0 24px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #26262666;
  color: #f4f7dc;
  // margin-top: calc(100vh - 80px);

  &:hover {
    ${Progress} {
      height: ${rem(9)};
    }
  }
`;

export const Controls = styled.div`
  flex-grow: 1;
  // margin: 0 ${rem(20)};
  display: flex;
//   flex-direction: column;
  justify-content: center;
  align-items: center;
`;