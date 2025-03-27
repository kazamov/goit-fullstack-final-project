import clsx from 'clsx';

import styles from './ButtonWithNumber.module.css';

type ButtonWithNumberProps = {
  type?: 'button';
  kind: 'inactive' | 'active';
  clickHandler?: () => void;
  disabled?: boolean;
  number: number | string;
};

const ButtonWithNumber = ({
  type = 'button',
  kind = 'inactive',
  clickHandler,
  disabled = false,
  number,
}: ButtonWithNumberProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx([
        styles[kind],
        styles.button,
        disabled && styles.disabled,
      ])}
      onClick={clickHandler}
    >
      <span className={styles.number}>{number}</span>
    </button>
  );
};

export default ButtonWithNumber;
