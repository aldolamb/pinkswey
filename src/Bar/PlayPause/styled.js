import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Button = styled.div`
    width: ${rem(40)};
    height: ${rem(36)};
    background-color: transparent;
    border: none;
    cursor: pointer;
    svg {
      width: inherit;
      height: inherit;
      fill: currentcolor;;
    }
`;
