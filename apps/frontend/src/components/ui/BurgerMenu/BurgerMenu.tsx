import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import Logo from '../Logo/Logo';
import MenuIcon from '../MenuIcon/MenuIcon';
import Modal from '../Modal/Modal';

import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isInversed: boolean;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ isInversed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <MenuIcon onClick={handleClick}>
        <svg
          className={clsx(styles.burgerMenu, { [styles.inversed]: isInversed })}
        >
          <use href="/src/images/icons.svg#icon-burger-menu" />
        </svg>
      </MenuIcon>
      <Modal
        isOpen={isOpen}
        headerContent={() => <Logo isInversed className={styles.logo} />}
        onClose={handleClose}
        fullScreen
      >
        <nav className={styles.nav}>
          <ul className={styles.navList} onClick={handleClose}>
            <li>
              <NavLink className={styles.navLink} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={styles.navLink} to="/recipe/add">
                Add recipe
              </NavLink>
            </li>
          </ul>
        </nav>
      </Modal>
    </>
  );
};

export default BurgerMenu;
