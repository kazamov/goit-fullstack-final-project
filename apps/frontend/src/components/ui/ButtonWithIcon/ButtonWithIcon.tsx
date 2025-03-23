import clsx from 'clsx';

import styles from './ButtonWithIcon.module.css';

type ButtonWithIconProps = {
  type?: 'button' | 'submit' | 'reset';
  kind: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'small' | 'medium' | 'large';
  clickHandler?: () => void;
  disabled?: boolean;
  iconType: string;
};

const ButtonWithIcon = ({
  type = 'button',
  kind = 'primary',
  size = 'medium',
  clickHandler,
  disabled = false,
  iconType,
}: ButtonWithIconProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([styles[kind], styles.button, styles[size]])}
      onClick={clickHandler}
    >
      <svg className={styles.icon}>
        <use href={`/src/images/icons.svg#${iconType}`} />
      </svg>
    </button>
  );
};

export default ButtonWithIcon;
