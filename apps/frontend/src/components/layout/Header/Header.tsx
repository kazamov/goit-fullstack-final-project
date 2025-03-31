import { useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import clsx from 'clsx';

import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { selectCurrentUser } from '../../../redux/users/selectors';
import AuthBar from '../../modules/Auth/AuthBar/AuthBar';
import UserBar from '../../modules/Auth/UserBar/UserBar';
import BurgerMenu from '../../ui/BurgerMenu/BurgerMenu';
import Logo from '../../ui/Logo/Logo';
import Navigation from '../../ui/Navigation/Navigation';
import Container from '../Container/Container';

import styles from './Header.module.css';

const Header = () => {
  const currentUser = useSelector(selectCurrentUser);

  const rootPath = useMatch('/');
  const recipesPath = useMatch('/recipes');

  const isInversed = Boolean(rootPath || recipesPath);
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <Container>
      <div className={styles.headerContainer}>
        <header
          className={clsx(styles.header, isInversed && styles.inversedHeader)}
        >
          <Logo isInversed={isInversed} />
          {currentUser && !isMobile && <Navigation isInversed={isInversed} />}

          {currentUser === null || currentUser ? (
            <>
              <AuthBar userSignedIn={Boolean(currentUser)} />

              <div className={styles.menuContainer}>
                <UserBar currentUser={currentUser} />
                {currentUser && isMobile && (
                  <BurgerMenu isInversed={isInversed} />
                )}
              </div>
            </>
          ) : (
            <div className={styles.skeleton}></div>
          )}
        </header>
      </div>
    </Container>
  );
};

export default Header;
