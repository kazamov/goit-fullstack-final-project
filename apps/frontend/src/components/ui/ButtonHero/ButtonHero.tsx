import type { FC, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './ButtonHero.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'small' | 'medium';
  clickHandler?: () => void;
  disabled?: boolean;
}

const ButtonHero: FC<ButtonProps> = ({
  children,
  type = 'button',
  kind = 'primary',
  size = 'medium',
  clickHandler,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([
        styles[kind],
        kind === 'text' ? styles.text : styles.button,
        styles[size],
      ])}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default ButtonHero;
