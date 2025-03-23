import type { FC } from 'react';
import React from 'react';
import clsx from 'clsx';

import styles from './Container.module.css';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className={clsx(styles.container)}>{children}</div>;
};

export default Container;
