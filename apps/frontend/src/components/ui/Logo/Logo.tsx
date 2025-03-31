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
    <NavLink
      className={clsx(
        className,
        styles.logo,
        isInversed && styles.inversedLogo,
      )}
      to="/"
      viewTransition
      aria-label="Foodies Home"
    >
      foodies
    </NavLink>
  );
};

export default Logo;
