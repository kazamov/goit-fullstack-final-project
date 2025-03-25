import { useEffect, useState } from 'react';

import {
  GetRecipeListResponseSchema,
  type GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';

import PopularRecipes from '../../components/modules/PopularRecipes/PopularRecipes';

const RecipePage = () => {
  const [popularRecipes, setPopularRecipes] = useState<GetRecipeResponse[]>([]);

  useEffect(() => {
    fetch('/api/recipes/popular')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then((data) => {
        setPopularRecipes(GetRecipeListResponseSchema.parse(data));
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
      });
  }, []);

  return (
    <>
      <div>RecipePage</div>
      <PopularRecipes recipes={popularRecipes} />
    </>
  );
};

export default RecipePage;
