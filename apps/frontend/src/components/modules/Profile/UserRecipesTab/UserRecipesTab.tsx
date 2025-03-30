import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { usePagingParams } from '../../../../hooks/usePagingParams';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function UserRecipesTab() {
  const { id: userId } = useParams<{ id: string }>();
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const emptyContentTemplate = useCallback((className: string) => {
    return (
      <p className={className}>
        Nothing has been added to your recipes list yet. Please browse our
        recipes and add your favorites for easy access in the future.
      </p>
    );
  }, []);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/${userId}/recipes?page=${page}&perPage=${perPage}`,
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

    fetchUserRecipes();
  }, [page, perPage, userId]);

  return (
    <RecipesTabContent
      recipes={recipesList}
      totalPages={totalPages}
      emptyContentTemplate={emptyContentTemplate}
    />
  );
}

export default UserRecipesTab;
