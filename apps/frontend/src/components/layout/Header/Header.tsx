import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

import AuthBar from '../../modules/Auth/AuthBar/AuthBar';
import UserBar from '../../modules/Auth/UserBar/UserBar';
import Logo from '../../ui/Logo/Logo';
import Navigation from '../../ui/Navigation/Navigation';

import styles from './Header.module.css';

const Header = () => {
  const location = useLocation();
  const isInversed = location.pathname === '/';
  const isUserAuthorized = false;

  return (
    <div className={clsx(styles.header, isInversed && styles.inversedHeader)}>
      <Logo isInversed={isInversed} />
      <Navigation isInversed={isInversed} />
      {isUserAuthorized ? <UserBar /> : <AuthBar />}
    </div>
  );
};

export default Header;
