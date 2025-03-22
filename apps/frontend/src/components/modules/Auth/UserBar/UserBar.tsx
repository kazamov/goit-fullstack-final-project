import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import BurgerMenu from '../../../ui/BurgerMenu/BurgerMenu';

import styles from './UserBar.module.css';

const UserBar = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className={styles.userBar}>UserBar {isMobile && <BurgerMenu />}</div>
  );
};

export default UserBar;
