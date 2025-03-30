import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_PER_PAGE = '9';
const DEFAULT_PAGE = '1';

interface PagingParamsResult {
  page: string;
  perPage: string;
}

export function usePagingParams(
  initialPage: string = DEFAULT_PAGE,
  initialPerPage: string = DEFAULT_PER_PAGE,
): PagingParamsResult {
  const [searchParams, setSearchParams] = useSearchParams({
    page: initialPage,
    perPage: initialPerPage,
  });

  useEffect(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);

      if (!newParams.has('page')) {
        newParams.set('page', DEFAULT_PAGE);
      }
      if (!newParams.has('perPage')) {
        newParams.set('perPage', DEFAULT_PER_PAGE);
      }

      return newParams;
    });
  }, [setSearchParams]);

  return {
    page: searchParams.get('page') as string,
    perPage: searchParams.get('perPage') as string,
  };
}
