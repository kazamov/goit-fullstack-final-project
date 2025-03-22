import BurgerMenu from '../../../ui/BurgerMenu/BurgerMenu';

import styles from './UserBar.module.css';

const UserBar = () => {
  return (
    <div className={styles.UserBar}>
      UserBar {window.innerWidth < 768 ? <BurgerMenu /> : null}
    </div>
  );
};

export default UserBar;
