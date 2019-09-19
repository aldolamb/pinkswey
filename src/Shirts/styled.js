import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Outer = styled.div`
  width: 100%;
`;

export const Inner = styled.div`
  width: 225px;
  height: 220px;
  background-size: 225px 220px;
  left: 50%;
  top: 50%;
  margin-left: -261px;
  // margin-top: -110px;
  position: relative;
`;

export const MenuSlice = styled.div`
  width: 75px;
  height: 220px;
  visibility: visible;
  z-index: 1;
  top: 0px;
  left: 0px;
  background-size: 58px 220px;

  position: absolute;
`;