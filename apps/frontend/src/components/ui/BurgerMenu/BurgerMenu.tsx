import { useState } from 'react';

import BurgerMenuIcon from '../BurgerMenuIcon/BurgerMenuIcon';
import CloseMenuIcon from '../CloseMenuIcon/CloseMenuIcon';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return isOpen ? (
    <CloseMenuIcon onClick={handleClick} />
  ) : (
    <BurgerMenuIcon onClick={handleClick} />
  );
};

export default BurgerMenu;
