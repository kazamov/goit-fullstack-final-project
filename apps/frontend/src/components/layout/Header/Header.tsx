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
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.6296 3.4574C15.2465 3.07416 14.7917 2.77014 14.2911 2.56272C13.7905 2.3553 13.254 2.24854 12.7121 2.24854C12.1702 2.24854 11.6337 2.3553 11.1331 2.56272C10.6325 2.77014 10.1777 3.07416 9.7946 3.4574L8.9996 4.2524L8.2046 3.4574C7.43083 2.68364 6.38137 2.24894 5.2871 2.24894C4.19283 2.24894 3.14337 2.68364 2.3696 3.4574C1.59583 4.23117 1.16113 5.28063 1.16113 6.3749C1.16113 7.46918 1.59583 8.51864 2.3696 9.2924L3.1646 10.0874L8.9996 15.9224L14.8346 10.0874L15.6296 9.2924C16.0128 8.90934 16.3169 8.45451 16.5243 7.95392C16.7317 7.45333 16.8385 6.91677 16.8385 6.3749C16.8385 5.83304 16.7317 5.29648 16.5243 4.79589C16.3169 4.29529 16.0128 3.84047 15.6296 3.4574Z"
                stroke="#050505"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Header;
