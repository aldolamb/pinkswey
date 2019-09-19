import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Visualizer = styled.canvas`
    position: fixed;
    top: 0;
    left: 0;
    // top: calc(50vh - 175px);
    // left: calc(50vw - 400px);
    cursor: pointer;
    z-index: -1;
`;
