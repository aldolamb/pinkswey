import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Bar = styled.div`
  user-select: none;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const Time = styled.span`
  color: white;
  font-size: ${rem(16)};
  width: ${rem(43)};
`;

export const Progress = styled.div`
  flex: 1;
  border-radius: ${rem(5)};
  margin: 0 ${rem(20)};
  height: ${rem(3)};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const ProgressKnob = styled.span`
  position: relative;
  height: ${rem(16)};
  width: ${rem(16)};
  border: ${rem(1.5)} solid #f4f7dc;
  border-radius: 50%;
  background-color: #262626;
`;
