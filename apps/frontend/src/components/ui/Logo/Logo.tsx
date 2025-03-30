import type { FC } from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

import styles from './Logo.module.css';

interface LogoProps {
  className?: string;
  isInversed: boolean;
}

const Logo: FC<LogoProps> = ({ isInversed, className }) => {
  return (
    <NavLink className={className} to="/" viewTransition>
      <span className={clsx(styles.logo, isInversed && styles.inversedLogo)}>
        foodies
      </span>
    </NavLink>
  );
};

export default Logo;
