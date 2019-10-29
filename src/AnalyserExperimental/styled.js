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


export const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background-color: #000000;
  color: #ffffff;
  > div {
    text-align: center;
    > button {
      height: 20px;
      width: 100px;
      background: transparent;
      color: #ffffff;
      outline: 1px solid #ffffff;
      border: 0px;
      cursor: pointer;
    }
    > p {
      color: #777777;
      font-size: 12px;
    }
  }
`;

export const ControlPanel = styled.div`
  position: absolute;
  right: 50px;
  top: 50px;
  background-color: grey;

`

