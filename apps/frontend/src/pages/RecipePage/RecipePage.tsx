import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type {
  GetPaginatedRecipeShort,
  GetRecipeDetailedResponse,
  GetRecipeResponse,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import {
  GetPaginatedRecipeShortSchema,
  GetRecipeDetailedResponseSchema,
  GetRecipeListResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import PopularRecipes from '../../components/modules/PopularRecipes/PopularRecipes';
import RecipeInfo from '../../components/modules/RecipeInfo/RecipeInfo';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import { tryCatch } from '../../helpers/catchError';
import { del, get, post } from '../../helpers/http';
import { scrollToTop } from '../../helpers/scrollToTop';
import { setModalOpened } from '../../redux/ui/slice';
import { selectCurrentUser } from '../../redux/users/selectors';

const RecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isUserLoggedIn = Boolean(currentUser);

  const [recipeDetails, setRecipeDetails] =
    useState<GetRecipeDetailedResponse>();
  const [popularRecipes, setPopularRecipes] = useState<GetRecipeResponse[]>([]);
  const [favorites, setFavorites] = useState<GetPaginatedRecipeShort>({
    items: [],
    page: 1,
    totalPages: 1,
  });

  // Get favorites from API
  useEffect(() => {
    if (!isUserLoggedIn) return;
    const fetchFavorites = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>('/api/users/favorites', {
          schema: GetPaginatedRecipeShortSchema,
        }),
      );
      if (error) {
        toast.error(`Error fetching favorites\n${error.message}`);
        return;
      }
      setFavorites(data);
    };
    fetchFavorites();
  }, [isUserLoggedIn]);

  // Get recipe details from API
  useEffect(() => {
    // Make sure recipeId is defined in URL before fetching
    if (!id) return;

    const fetchRecipeDetails = async (recipeId: string) => {
      const [error, data] = await tryCatch(
        get<GetRecipeDetailedResponse>(`/api/recipes/${recipeId}`, {
          schema: GetRecipeDetailedResponseSchema,
        }),
      );

      if (error) {
        toast.error(`Error fetching recipe details\n${error.message}`);
        return;
      }

      setRecipeDetails(data);
    };

    fetchRecipeDetails(id);
  }, [id]);

  // Get popular recipes from API
  useEffect(() => {
    const fetchPopularRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetRecipeResponse[]>('/api/recipes/popular', {
          schema: GetRecipeListResponseSchema,
        }),
      );

      if (error) {
        toast.error(`Error fetching popular recipes\n${error.message}`);
        return;
      }

      setPopularRecipes(data);
    };

    fetchPopularRecipes();
  }, []);

  // Handle open profile
  const handleOpenProfile = useCallback(
    (userId: string) => {
      if (!isUserLoggedIn) {
        dispatch(setModalOpened({ modal: 'login', opened: true }));
        return;
      }
      navigate(`/user/${userId}`);
      scrollToTop();
    },
    [isUserLoggedIn, dispatch, navigate],
  );

  // handle toggle favorite
  const handleToggleFavorite = useCallback(
    async (recipeId: string, newState: boolean) => {
      if (!isUserLoggedIn) {
        dispatch(setModalOpened({ modal: 'login', opened: true }));
        return;
      }
      const [error] = await tryCatch(
        newState
          ? post(`/api/recipes/${recipeId}/favorite`, null)
          : del(`/api/recipes/${recipeId}/favorite`),
      );
      if (error) {
        toast.error(`Error updating favorites\n${error.message}`);
        return;
      }
      // Update local state of favorites
      setFavorites((prev) => {
        if (newState) {
          // Add recipe to favorites
          const foundRecipe = popularRecipes.find((r) => r.id === recipeId);
          if (!foundRecipe) return prev;
          const shortRecipe: GetRecipeShort = {
            id: foundRecipe.id,
            title: foundRecipe.title,
            thumb: foundRecipe.thumb,
            description: foundRecipe.description,
          };
          return { ...prev, items: [...prev.items, shortRecipe] };
        }
        // Remove recipe from favorites
        return {
          ...prev,
          items: prev.items.filter((item) => item.id !== recipeId),
        };
      });
    },
    [isUserLoggedIn, dispatch, popularRecipes],
  );

  // handle open recipe
  const handleOpenRecipe = useCallback(
    (recipeId: string) => {
      navigate(`/recipe/${recipeId}`);
      scrollToTop();
    },
    [navigate],
  );

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
          <RecipeInfo
            recipe={recipeDetails}
            onOpenProfile={handleOpenProfile}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.items.some(
              (item) => item.id === recipeDetails.id,
            )}
          />
        </Container>
      )}
      <PopularRecipes
        recipes={popularRecipes}
        favorites={favorites}
        onOpenProfile={handleOpenProfile}
        onToggleFavorite={handleToggleFavorite}
        onOpenRecipe={handleOpenRecipe}
      />
    </>
  );
};

export default RecipePage;
