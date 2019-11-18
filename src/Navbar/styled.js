import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Top = styled.ul`
  position: absolute;
  list-style-type: none;
  margin: 0;
  padding: 0;
  top: ${rem(36)};
  color: #f4f7dc;
  left: ${rem(24)};
  // width: 100%;

  li {
    display: inline; 
    a {
      padding: 0 ${rem(30)}; 
      cursor: pointer;
      color: inherit;
      text-decoration: inherit;
    }
  }
`;

export const Right = styled.ul`
  position: absolute;
  list-style-type: none;
  // margin: 0;
  padding: 0;
  top: 50vh;
  color: #f4f7dc;
  right: ${rem(-130)};
  width: ${rem(300)};
  transform: rotate(-90deg);
  transform-origin: 50% 100%;

  li {
    display: inline; 
    a {
      padding: 0 ${rem(16)}; 
      cursor: pointer;
      color: inherit;
      text-decoration: inherit;
    }
  }
`;
