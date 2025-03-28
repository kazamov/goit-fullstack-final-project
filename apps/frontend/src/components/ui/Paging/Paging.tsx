import type { FC } from 'react';
import { Fragment, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import ButtonWithNumber from '../ButtonWithNumber/ButtonWithNumber';

import styles from './Paging.module.css';

type PagingProps = {
  totalPages: number;
  maxVisibleButtons?: number;
};

const Paging: FC<PagingProps> = ({ totalPages, maxVisibleButtons = 7 }) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: '1' });
  const currentPage = Number(searchParams.get('page'));

  const handlePageClick = useCallback(
    (page: number) => {
      setSearchParams((prevParams) => {
        const newParams = new URLSearchParams(prevParams);
        newParams.set('page', String(page));
        return newParams;
      });
    },
    [setSearchParams],
  );

  const pageNumbers = useMemo(() => {
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
  }, [currentPage, maxVisibleButtons, totalPages]);

  return (
    <div className={styles.pagingContainer}>
      {pageNumbers.map((page, index) => (
        <Fragment key={index}>
          {page === '...' ? (
            <span className={`${styles.ellipsis}`}>...</span>
          ) : (
            <ButtonWithNumber
              key={page}
              kind={page === currentPage ? 'active' : 'inactive'}
              number={Number(page)}
              clickHandler={() => handlePageClick(Number(page))}
              disabled={page === currentPage}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default Paging;
