import { NavLink } from 'react-router-dom';

import styles from './MobileMenu.module.css';

const MobileMenu = () => {
  return (
    <div className={styles.MobileMenu}>
      <NavLink to="/" className={styles.MobileMenuLink}>
        Home
      </NavLink>
      <NavLink to="/recipe/add" className={styles.MobileMenuLink}>
        Add recipe
      </NavLink>
    </div>
  );
};

export default MobileMenu;
