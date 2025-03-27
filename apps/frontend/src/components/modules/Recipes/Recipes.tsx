import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeResponse,
  GetPaginatedRecipeShort,
  GetRecipeShort,
  RecipeQuery,
} from '@goit-fullstack-final-project/schemas';
import {
  GetPaginatedRecipeResponseSchema,
  GetPaginatedRecipeShortSchema,
} from '@goit-fullstack-final-project/schemas';

import { buildQueryString } from '../../../helpers/buildQueryString';
import { tryCatch } from '../../../helpers/catchError';
import { del, get, post } from '../../../helpers/http';
import { scrollToTop } from '../../../helpers/scrollToTop';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import type { SelectedCategory } from '../../../redux/categories/slice';
import { resetCategory } from '../../../redux/categories/slice';
import { setModalOpened } from '../../../redux/ui/slice';
import { selectCurrentUser } from '../../../redux/users/selectors';
import Container from '../../layout/Container/Container';
import MainTitle from '../../ui/MainTitle/MainTitle';
import SubTitle from '../../ui/SubTitle/SubTitle';

import RecipeList from './RecipeList/RecipeList';

import styles from './Recipes.module.css';

interface CategoriesProps {
  category: SelectedCategory;
}

const Recipes = ({ category }: CategoriesProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const isUserLoggedIn = Boolean(currentUser);
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [recipes, setRecipes] = useState<GetPaginatedRecipeResponse>({
    items: [],
    page: 1,
    totalPages: 1,
  });
  const [favorites, setFavorites] = useState<GetPaginatedRecipeShort>({
    items: [],
    page: 1,
    totalPages: 1,
  });
  const [query, setQuery] = useState<RecipeQuery>({
    page: '1',
    perPage: isMobile ? '8' : '12',
    categoryId: category?.id,
    areaId: undefined,
    ingredientId: undefined,
  });

  // Scroll to top on component load
  useEffect(() => {
    scrollToTop();
  }, [query]);

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

  // Get recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      const queryString = buildQueryString(query);

      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeResponse>(`/api/recipes?${queryString}`, {
          schema: GetPaginatedRecipeResponseSchema,
        }),
      );

      if (error) {
        toast.error(`Error fetching popular recipes\n${error.message}`);
        return;
      }

      setRecipes(data);
    };

    fetchRecipes();
  }, [query]);

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
          const foundRecipe = recipes.items.find((r) => r.id === recipeId);
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
    [isUserLoggedIn, dispatch, recipes],
  );

  // handle open recipe
  const handleOpenRecipe = useCallback(
    (recipeId: string) => {
      navigate(`/recipe/${recipeId}`);
      scrollToTop();
    },
    [navigate],
  );

  const handleOnPageChange = useCallback(
    (page: number) => {
      setQuery((prev) => ({ ...prev, page: String(page) }));
    },
    [setQuery],
  );

  return (
    <section id="recipes">
      <Container>
        <button
          className={clsx(styles.backButton)}
          onClick={() => {
            dispatch(resetCategory());
            scrollToTop();
          }}
        >
          <svg className={clsx(styles.backButtonIcon)}>
            <use href={`/images/icons.svg#icon-arrow-left`} />
          </svg>
          <span className={clsx(styles.backButtonText)}>Back</span>
        </button>
        <MainTitle title={category.name} />
        <SubTitle title={category.description} />
        <div className={clsx(styles.recipesWrapper)}>
          <div>
            {/* <RecipeFilters /> */}
            RecipeFilters
          </div>
          {recipes.items.length > 0 ? (
            <RecipeList
              recipes={recipes}
              favorites={favorites}
              onOpenProfile={handleOpenProfile}
              onToggleFavorite={handleToggleFavorite}
              onOpenRecipe={handleOpenRecipe}
              onPageChange={handleOnPageChange}
            />
          ) : (
            <p className={clsx(styles.noRecipes)}>
              No recipes found by your filters. Please change filters or try
              again.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
};

export default Recipes;
