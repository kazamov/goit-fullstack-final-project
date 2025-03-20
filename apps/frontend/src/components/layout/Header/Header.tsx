import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import AuthBar from '../../modules/Auth/AuthBar/AuthBar';
import UserBar from '../../modules/Auth/UserBar/UserBar';
import Logo from '../../ui/Logo/Logo';
import Navigation from '../../ui/Navigation/Navigation';

import styles from './Header.module.css';

const Header = () => {
  // TO DO: set authorized while integration
  const location = useLocation();
  const isInversed = location.pathname === '/';
  const isUserAuthorized = location.pathname !== '/';

  return (
    <div className={styles.headerContainer}>
      <div className={clsx(styles.header, isInversed && styles.inversedHeader)}>
        <Logo isInversed={isInversed} />
        {isUserAuthorized && <Navigation isInversed={isInversed} />}
        {isUserAuthorized ? <UserBar /> : <AuthBar />}
      </div>
    </div>
  );
};

export default Header;
