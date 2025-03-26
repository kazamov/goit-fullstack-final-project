import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type {
  GetRecipeDetailedResponse,
  GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';
import {
  GetRecipeDetailedResponseSchema,
  GetRecipeListResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import PopularRecipes from '../../components/modules/PopularRecipes/PopularRecipes';
import RecipeInfo from '../../components/modules/RecipeInfo/RecipeInfo';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipeDetails, setRecipeDetails] =
    useState<GetRecipeDetailedResponse>();
  const [popularRecipes, setPopularRecipes] = useState<GetRecipeResponse[]>([]);

  useEffect(() => {
    // Make sure id is defined before fetching
    if (!id) return;

    const fetchRecipeDetails = async (recipeId: string) => {
      const [error, data] = await tryCatch(
        get<GetRecipeDetailedResponse>(`/api/recipes/${recipeId}`, {
          schema: GetRecipeDetailedResponseSchema,
        }),
      );

      if (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
        return;
      }

      setRecipeDetails(data);
    };

    fetchRecipeDetails(id);
  }, [id]);

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
      {recipeDetails && (
        <Container>
          <PathInfo
            pages={[
              { name: 'Home', path: '/' },
              { name: recipeDetails.title, path: `/recipe/${id}` },
            ]}
          />
          <RecipeInfo recipe={recipeDetails} />
        </Container>
      )}
      <PopularRecipes recipes={popularRecipes} />
    </>
  );
};

export default RecipePage;
