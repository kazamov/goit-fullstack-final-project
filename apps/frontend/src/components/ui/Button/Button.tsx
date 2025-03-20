import type { FC, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium';
  clickHandler?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
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
      className={clsx([styles[kind], styles.button, styles[size]])}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
