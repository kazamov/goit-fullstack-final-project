import type { FC } from 'react';
import clsx from 'clsx';

import Paging from '../../../../ui/Paging/Paging';

import styles from './RecipePagination.module.css';

interface RecipePaginationProps {
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export const RecipePagination: FC<RecipePaginationProps> = ({
  totalPages,
  onPageChange,
}) => {
  return (
    <div
      className={clsx(styles.paginationContainer)}
      id="recipePaginationContainer"
    >
      <Paging totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
};
