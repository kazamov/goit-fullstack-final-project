import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';
import { usePagingParams } from '../usePagingParams';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyFavoritesTab() {
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/favorites?page=${page}&perPage=${perPage}`,
          { schema: GetPaginatedRecipeShortSchema },
        ),
      );

      if (error) {
        toast.error(error.message);
        setRecipesList([]);
        return;
      }

      setRecipesList(data.items);
      setTotalPages(data.totalPages);
    };

    fetchFavoriteRecipes();
  }, [page, perPage]);

  return <RecipesTabContent recipes={recipesList} totalPages={totalPages} />;
}

export default MyFavoritesTab;
