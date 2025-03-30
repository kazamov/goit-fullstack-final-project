import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';

function UserRecipesTab() {
  const { id: userId } = useParams<{ id: string }>();

  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/${userId}/recipes?page=${1}&limit=${10}`,
          { schema: GetPaginatedRecipeShortSchema },
        ),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setRecipesList(data.items);
    };

    fetchUserRecipes();
  }, [userId]);

  return (
    <RecipesTabContent
      recipes={recipesList}
      pagination={{ page: 1, totalPages: 1 }}
    />
  );
}

export default UserRecipesTab;
