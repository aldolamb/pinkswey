import React from 'react';
import styled from 'styled-components';
import {
  rem
} from 'polished';

export const Table = styled.table`
    width: 100%;
    padding: 0 ${rem(20)};
    background-color: #26262666;
`;

export const Row = styled.tr`
    height: ${rem(40)};
    border: none;
`;

export const Cell = styled.td`
`;
