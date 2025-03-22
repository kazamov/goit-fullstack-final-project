import { NavLink } from 'react-router-dom';

import styles from './MobileMenu.module.css';

const MobileMenu = () => {
  return (
    <div className={styles.mobileMenu}>
      <NavLink to="/" className={styles.mobileMenuLink}>
        Home
      </NavLink>
      <NavLink to="/recipe/add" className={styles.mobileMenuLink}>
        Add recipe
      </NavLink>
    </div>
  );
};

export default MobileMenu;
