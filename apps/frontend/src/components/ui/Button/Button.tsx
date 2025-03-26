import type { FC, ReactNode, SVGProps } from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'small' | 'medium';
  clickHandler?: () => void;
  disabled?: boolean;
  busy?: boolean;
  className?: string;
}

export function SvgSpinners180RingWithBg(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={styles.spinner}
      {...props}
    >
      <path
        fill="currentColor"
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      ></path>
      <path
        fill="currentColor"
        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
      ></path>
    </svg>
  );
}

const Button: FC<ButtonProps> = ({
  children,
  type = 'button',
  kind = 'primary',
  size = 'medium',
  clickHandler,
  disabled = false,
  busy = false,
  className = '',
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([
        styles[kind],
        kind === 'text' ? styles.text : styles.button,
        styles[size],
        styles[className],
      ])}
      onClick={clickHandler}
    >
      {busy && <SvgSpinners180RingWithBg width={20} height={20} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
