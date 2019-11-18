import React from "react";
import {
  Top,
  Right,
} from './styled';
import PinkSwey from '../assets/PinkSwey';

const Navbar = () => {

  return (
    <div>
      <Top>
        <li><a href={"./"}><PinkSwey/></a></li>
        <li><a href={"./listen"}>Listen</a></li>
        <li><a href={"./watch"}>Watch</a></li>
        <li><a href={"./shop"}>Shop</a></li>
        <li><a href={"./contact"}>Contact</a></li>
      </Top>
      <Right>
        <li><a href={"./listen"}>Graveyard Shift I</a></li>
        <li><a href={"./watch"}>Graveyard Shift II</a></li>
      </Right>
    </div>
  );
}

export default Navbar;
