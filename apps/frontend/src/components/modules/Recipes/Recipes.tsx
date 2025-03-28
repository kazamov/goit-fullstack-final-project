import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeResponse,
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import {
  GetPaginatedRecipeResponseSchema,
  GetPaginatedRecipeShortSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../helpers/catchError';
import { del, get, post } from '../../../helpers/http';
import { scrollToElement, scrollToTop } from '../../../helpers/scrollToTop';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import type { SelectedCategory } from '../../../redux/categories/slice';
import { setModalOpened } from '../../../redux/ui/slice';
import { selectCurrentUser } from '../../../redux/users/selectors';
import Container from '../../layout/Container/Container';
import MainTitle from '../../ui/MainTitle/MainTitle';
import SubTitle from '../../ui/SubTitle/SubTitle';

import RecipeFilters from './RecipeFilters/RecipeFilters';
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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        if (!newParams.has('page')) {
          newParams.set('page', '1');
        }
        if (!newParams.has('perPage')) {
          newParams.set('perPage', isMobile ? '8' : '12');
        }
        return newParams;
      },
      { replace: true },
    );
  }, [isMobile, setSearchParams]);

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
      const queryString = searchParams.toString();

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
  }, [searchParams]);

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
      navigate(`/recipes/${recipeId}`);
      scrollToTop();
    },
    [navigate],
  );

  return (
    <section id="recipes">
      <Container>
        <button
          ref={(element) => {
            if (element) {
              scrollToElement(element);
            }
          }}
          className={clsx(styles.backButton)}
          onClick={() => {
            navigate('/');
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
          <RecipeFilters />
          {recipes.items.length > 0 ? (
            <RecipeList
              recipes={recipes}
              favorites={favorites}
              onOpenProfile={handleOpenProfile}
              onToggleFavorite={handleToggleFavorite}
              onOpenRecipe={handleOpenRecipe}
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
