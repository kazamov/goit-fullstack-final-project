import clsx from 'clsx';

import { SvgSpinners180RingWithBg } from '../Button/Button';

import styles from './ButtonWithIcon.module.css';

type ButtonWithIconProps = {
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'small' | 'medium' | 'large';
  clickHandler?: () => void;
  disabled?: boolean;
  iconType: string;
  busy: boolean;
};

const ButtonWithIcon = ({
  type = 'button',
  kind = 'primary',
  size = 'medium',
  clickHandler,
  disabled = false,
  iconType,
  busy,
}: ButtonWithIconProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([styles[kind], styles.button, styles[size]])}
      onClick={clickHandler}
    >
      {!busy && (
        <svg className={styles.icon}>
          <use href={`/images/icons.svg#${iconType}`} />
        </svg>
      )}
      {busy && (
        <SvgSpinners180RingWithBg width={20} height={20} color="#ffffff" />
      )}
    </button>
  );
};

export default ButtonWithIcon;
