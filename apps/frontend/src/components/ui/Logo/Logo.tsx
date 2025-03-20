import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Logo.module.css';

interface LogoProps {
  isInversed: boolean;
}

const Logo: FC<LogoProps> = ({ isInversed }) => {
  return (
    <NavLink to="/">
      <span className={clsx(styles.logo, isInversed && styles.inversedLogo)}>
        foodies
      </span>
    </NavLink>
  );
};

export default Logo;
