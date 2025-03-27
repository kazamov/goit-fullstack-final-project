import React, { useState } from 'react';

import ButtonWithNumber from '../ButtonWithNumber/ButtonWithNumber';

import styles from './Paging.module.css';

type PagingProps = {
  totalPages: number;
  maxVisibleButtons?: number;
  onPageChange?: (page: number) => void;
  size?: 'small' | 'medium' | 'large';
};

const Paging: React.FC<PagingProps> = ({
  totalPages,
  maxVisibleButtons = 7,
  onPageChange,
  size = 'medium',
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const numSideButtons = Math.floor((maxVisibleButtons - 4) / 2);

    if (totalPages <= maxVisibleButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pageNumbers.push(1);

    let leftSibling = Math.max(2, currentPage - numSideButtons);
    let rightSibling = Math.min(totalPages - 1, currentPage + numSideButtons);

    if (currentPage <= numSideButtons + 2) {
      rightSibling = Math.min(totalPages - 1, maxVisibleButtons - 2);
    }
    if (currentPage >= totalPages - numSideButtons - 1) {
      leftSibling = Math.max(2, totalPages - (maxVisibleButtons - 3));
    }

    if (leftSibling > 2) {
      pageNumbers.push('...');
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pageNumbers.push(i);
    }

    if (rightSibling < totalPages - 1) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages);

    if (pageNumbers.length > maxVisibleButtons) {
      while (pageNumbers.length > maxVisibleButtons) {
        if (typeof pageNumbers[1] === 'number' && pageNumbers[2] === '...') {
          pageNumbers.splice(2, 1);
        } else if (
          typeof pageNumbers[pageNumbers.length - 2] === 'number' &&
          pageNumbers[pageNumbers.length - 3] === '...'
        ) {
          pageNumbers.splice(pageNumbers.length - 3, 1);
        } else {
          break;
        }
      }
    }

    return pageNumbers;
  };

  return (
    <div className={styles.pagingContainer}>
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className={`${styles.ellipsis} ${styles[size]}`}>...</span>
          ) : (
            <ButtonWithNumber
              key={page}
              kind={page === currentPage ? 'active' : 'inactive'}
              number={Number(page)}
              size={size}
              clickHandler={() => handlePageClick(Number(page))}
              disabled={page === currentPage}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Paging;
