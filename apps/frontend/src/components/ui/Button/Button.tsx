import type { FC, ReactNode } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary';
  clickHandler?: () => void;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  type = 'button',
  kind = 'primary',
  clickHandler,
  disabled = false,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([styles[kind], styles.button])}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default Button;
