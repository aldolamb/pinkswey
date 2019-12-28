import React from "react";
import {
  Top,
  Right,
} from './styled';
import PinkSwey from '../assets/PinkSwey';
import Listen from '../assets/icons/Listen.svg';
import Watch from '../assets/icons/Watch.svg';
import Shop from '../assets/icons/Shop.svg';
import Info from '../assets/icons/Info.svg';

const Navbar = () => {

  return (
    <div>
      <Top>
        <li><a href={"./"}><PinkSwey/></a></li>
        <li><img src={Listen}/></li>
        <li><img src={Watch}/></li>
        <li><img src={Shop}/></li>
        <li><img src={Info}/></li>
        {/* <li><Watch/></li> */}
        {/* <li><Shop/></li> */}
        {/* <li><a href={"./contact"}>Contact</a></li> */}
        {/* <li><a href={"./listen"}>Listen</a></li>
        <li><a href={"./watch"}>Watch</a></li>
        <li><a href={"./shop"}>Shop</a></li>
        <li><a href={"./contact"}>Contact</a></li> */}
      </Top>
      <Right>
        <li><a href={"./listen"}>Graveyard Shift I</a></li>
        <li><a href={"./watch"}>Graveyard Shift II</a></li>
      </Right>
    </div>
  );
}

export default Navbar;
