import { useEffect, useState } from 'react';

import {
  GetRecipeListResponseSchema,
  type GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';

import PopularRecipes from '../../components/modules/PopularRecipes/PopularRecipes';
import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

const RecipePage = () => {
  const [popularRecipes, setPopularRecipes] = useState<GetRecipeResponse[]>([]);

  useEffect(() => {
    const fetchPopularRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetRecipeResponse[]>('/api/recipes/popular', {
          schema: GetRecipeListResponseSchema,
        }),
      );

      if (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
        return;
      }

      setPopularRecipes(data);
    };

    fetchPopularRecipes();
  }, []);

  return (
    <>
      <div>RecipePage</div>
      <PopularRecipes recipes={popularRecipes} />
    </>
  );
};

export default RecipePage;
