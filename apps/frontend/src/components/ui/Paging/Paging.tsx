import React, { useState } from 'react';

import ButtonWithNumber from '../ButtonWithNumber/ButtonWithNumber';

import styles from './Paging.module.css';

type PagingProps = {
  totalPages: number;
  onPageChange?: (page: number) => void;
};

const Paging: React.FC<PagingProps> = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return (
    <div className={styles.pagingContainer}>
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <ButtonWithNumber
            key={pageNumber}
            kind={pageNumber === currentPage ? 'active' : 'inactive'}
            number={pageNumber}
            clickHandler={() => handlePageClick(pageNumber)}
            disabled={pageNumber === currentPage}
          />
        );
      })}
    </div>
  );
};

export default Paging;
