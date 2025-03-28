import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
  const [, setSearchParams] = useSearchParams();

  const [recipeDetails, setRecipeDetails] =
    useState<GetRecipeDetailedResponse>();
  const [popularRecipes, setPopularRecipes] = useState<GetRecipeResponse[]>([]);
  const [favorites, setFavorites] = useState<GetPaginatedRecipeShort>({
    items: [],
    page: 1,
    totalPages: 1,
  });
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

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
      setIsFavorite(data.items.some((item) => item.id === id));
    };
    fetchFavorites();
  }, [isUserLoggedIn, id]);

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
      const redirectUrl = `/user/${userId}`;

      if (!isUserLoggedIn) {
        setSearchParams(
          {
            redirect_url: redirectUrl,
          },
          {
            replace: true,
          },
        );

        dispatch(setModalOpened({ modal: 'login', opened: true }));
        return;
      }
      navigate(redirectUrl);
      scrollToTop();
    },
    [isUserLoggedIn, navigate, setSearchParams, dispatch],
  );

  // handle toggle favorite
  const handleToggleFavorite = useCallback(
    async (recipeId: string, newState: boolean) => {
      if (!isUserLoggedIn) {
        dispatch(setModalOpened({ modal: 'login', opened: true }));
        return;
      }

      // set button loader ON
      if (id === recipeId) {
        setIsBusy(true);
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
      if (id === recipeId) {
        setIsFavorite(newState);
        setIsBusy(false);
      }
    },
    [isUserLoggedIn, dispatch, popularRecipes, id],
  );

  // handle open recipe
  const handleOpenRecipe = useCallback(
    (recipeId: string) => {
      navigate(`/recipes/${recipeId}`);
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
              { name: recipeDetails.title, path: `/recipes/${id}` },
            ]}
          />
          <RecipeInfo
            recipe={recipeDetails}
            onOpenProfile={handleOpenProfile}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            isBusy={isBusy}
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
