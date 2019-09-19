import React, {useEffect} from "react";

import {
  Outer,
  Inner,
  MenuSlice
} from './styled';

function Shirts() {

  return (
    <Outer>
      <Inner>
          <MenuSlice style={{left: "0", background: 'red'}}/>
          <MenuSlice style={{left: "58px", background: 'orange'}}/>
          <MenuSlice style={{left: "116px", background: 'yellow'}}/>
      </Inner>
    </Outer>
  );
}

export default Shirts;
