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

function MyFavoritesTab() {
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/favorites?page=${1}&limit=${10}`,
          { schema: GetPaginatedRecipeShortSchema },
        ),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setRecipesList(data.items);
    };

    fetchFavoriteRecipes();
  }, []);

  return (
    <RecipesTabContent
      recipes={recipesList}
      pagination={{ page: 1, totalPages: 1 }}
    />
  );
}

export default MyFavoritesTab;
