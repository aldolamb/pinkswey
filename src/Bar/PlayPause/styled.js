import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Button = styled.div`
    width: ${rem(20)};
    height: ${rem(18)};
    background-color: transparent;
    border: none;
    cursor: pointer;
    svg {
      width: inherit;
      height: inherit;
      fill: currentcolor;;
    }
`;
