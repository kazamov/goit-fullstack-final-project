import type { FC } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import { setModalOpened } from '../../../redux/ui/slice';
import Logo from '../Logo/Logo';
import MenuIcon from '../MenuIcon/MenuIcon';
import Modal from '../Modal/Modal';

import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isInversed: boolean;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ isInversed }) => {
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(setModalOpened({ modal: 'mobileNavigation', opened: true }));
  }, [dispatch]);

  const handleClose = useCallback(() => {
    dispatch(setModalOpened({ modal: 'mobileNavigation', opened: false }));
  }, [dispatch]);

  return (
    <>
      <MenuIcon onClick={handleClick}>
        <svg
          className={clsx(styles.burgerMenu, { [styles.inversed]: isInversed })}
        >
          <use href="/images/icons.svg#icon-burger-menu" />
        </svg>
      </MenuIcon>
      <Modal
        type="mobileNavigation"
        headerContent={() => <Logo isInversed className={styles.logo} />}
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
