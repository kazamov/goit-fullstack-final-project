import type { FC } from 'react';
import clsx from 'clsx';

import Paging from '../../../../ui/Paging/Paging';

import styles from './RecipePagination.module.css';

interface RecipePaginationProps {
  totalPages: number;
}

export const RecipePagination: FC<RecipePaginationProps> = ({ totalPages }) => {
  return (
    <div
      className={clsx(styles.paginationContainer)}
      id="recipePaginationContainer"
    >
      <Paging totalPages={totalPages} />
    </div>
  );
};
