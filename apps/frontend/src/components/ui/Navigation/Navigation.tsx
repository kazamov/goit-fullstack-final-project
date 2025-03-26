import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Navigation.module.css';

interface NavProps {
  isInversed: boolean;
}

const buildLinkClass = ({
  isActive,
  isInversed,
}: {
  isActive: boolean;
  isInversed?: boolean;
}) => {
  return clsx(
    styles.navLink,
    isActive && styles.active,
    isInversed && styles.inversedNavLink,
  );
};

const Navigation: FC<NavProps> = ({ isInversed }) => {
  return (
    <nav className={clsx(styles.nav, { [styles.navInversed]: isInversed })}>
      <ul className={styles.navLinks}>
        <li>
          <NavLink
            to="/"
            className={(navData) => buildLinkClass({ ...navData, isInversed })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/recipe/add"
            className={(navData) => buildLinkClass({ ...navData, isInversed })}
          >
            Add recipe
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
