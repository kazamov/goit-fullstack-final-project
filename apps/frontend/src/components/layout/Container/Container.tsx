import type { FC } from 'react';
import React from 'react';
import clsx from 'clsx';

import styles from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};

export default Container;
