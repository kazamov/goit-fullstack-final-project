import type { FC } from 'react';
import clsx from 'clsx';

import styles from './Badge.module.css';

interface BadgeProps {
  text: string;
}

const Badge: FC<BadgeProps> = ({ text }) => {
  return <span className={clsx(styles.badge)}>{text}</span>;
};

export default Badge;
