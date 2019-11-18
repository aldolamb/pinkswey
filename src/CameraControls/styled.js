import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const CameraPresets = styled.div`
  -webkit-transition: opacity 0.5s linear;
  -moz-transition: opacity 0.5s linear;
  -o-transition: opacity 0.5s linear;
  transition: opacity 0.5s linear;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  position: absolute;
  top: 80px;
  right: 115px;
  color: #fff;
  font-size: 0;

  button {
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    background-color: #f4f7dc;
    box-shadow: 0 -1px 0 #aaac9a;
    box-sizing: border-box;
    cursor: pointer;  
    &:focus {outline:0;}
    &:active {
      box-shadow: none;
      margin-top: 1px;
    }
  }
  button:nth-child(1) {
    left: -30px;
  }
  button:nth-child(2) {
    top: -30px;
  }
  button:nth-child(3) {
    left: 30px;
  }
  button:nth-child(4) {
    top: 30px;
  }
`

