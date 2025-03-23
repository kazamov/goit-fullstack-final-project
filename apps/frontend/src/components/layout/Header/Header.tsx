import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { useMediaQuery } from '../../../hooks/useMediaQuery';
import AuthBar from '../../modules/Auth/AuthBar/AuthBar';
import UserBar from '../../modules/Auth/UserBar/UserBar';
import BurgerMenu from '../../ui/BurgerMenu/BurgerMenu';
import Logo from '../../ui/Logo/Logo';
import Navigation from '../../ui/Navigation/Navigation';
import Container from '../Container/Container';

import styles from './Header.module.css';

const Header = () => {
  // TO DO: set authorized while integration
  const location = useLocation();
  const isInversed = location.pathname === '/';
  const isUserAuthorized = location.pathname !== '/' || true;
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <Container>
      <div className={styles.headerContainer}>
        <div
          className={clsx(styles.header, isInversed && styles.inversedHeader)}
        >
          <Logo isInversed={isInversed} />
          {isUserAuthorized && !isMobile && (
            <Navigation isInversed={isInversed} />
          )}

          {!isUserAuthorized && <AuthBar />}
          <div className={styles.menuContainer}>
            {isUserAuthorized && <UserBar />}
            {isUserAuthorized && isMobile && (
              <BurgerMenu isInversed={isInversed} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Header;
