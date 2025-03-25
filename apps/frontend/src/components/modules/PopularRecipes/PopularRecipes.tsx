import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeShort,
  GetRecipeResponse,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../helpers/catchError';
import { del, get, post } from '../../../helpers/http';
import { selectCurrentUser } from '../../../redux/users/selectors';
import Container from '../../layout/Container/Container';
import RecipeCard from '../../ui/RecipeCard/RecipeCard';

import styles from './PopularRecipes.module.css';

interface PopularRecipesProps {
  recipes: GetRecipeResponse[];
}

const PopularRecipes: FC<PopularRecipesProps> = ({ recipes }) => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isUserLoggedIn = Boolean(currentUser);

  const [favorites, setFavorites] = useState<GetPaginatedRecipeShort>({
    items: [],
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    if (!isUserLoggedIn) return;

    const fetchFavorites = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>('/api/users/favorites', {
          schema: GetPaginatedRecipeShortSchema,
        }),
      );

      if (error) {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        );
        return;
      }

      setFavorites(data);
    };

    fetchFavorites();
  }, [isUserLoggedIn]);

  const handleOpenProfile = (userId: string) => {
    if (isUserLoggedIn) {
      navigate(`/user/${userId}`);
    } else {
      console.log('You need to login first!');
      // TODO: Відкриття модального вікна login
    }
  };

  const handleToggleFavorite = async (recipeId: string, newState: boolean) => {
    if (!isUserLoggedIn) {
      console.log('You need to login first!');
      // TODO: Відкрити модальне вікно логіну
      return;
    }

    const [error] = await tryCatch(
      newState
        ? post(`/api/recipes/${recipeId}/favorite`, {})
        : del(`/api/recipes/${recipeId}/favorite`),
    );

    if (error) {
      console.error('Error updating favorites:', error);
      return;
    }

    setFavorites((prev) => {
      if (newState) {
        // Find recipe in list for adding
        const foundRecipe = recipes.find((r) => r.id === recipeId);
        if (!foundRecipe) return prev;

        const shortRecipe: GetRecipeShort = {
          id: foundRecipe.id,
          title: foundRecipe.title,
          thumb: foundRecipe.thumb,
          description: foundRecipe.description,
        };

        return {
          ...prev,
          items: [...prev.items, shortRecipe],
        };
      }

      // Remove recipe from favorites list
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== recipeId),
      };
    });
  };

  const handleOpenRecipe = (recipeId: string) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <section id="popular-recipes" className={clsx(styles.section)}>
      <Container>
        <h2 className={clsx(styles.title)}>Popular recipes</h2>
        <ul className={clsx(styles.list)}>
          {recipes.map((recipe) => (
            <li key={recipe.id} className={clsx(styles.item)}>
              <RecipeCard
                recipe={recipe}
                isFavorite={favorites.items.some(
                  (item) => item.id === recipe.id,
                )}
                onOpenProfile={() => handleOpenProfile(recipe.owner.userId)}
                onToggleFavorite={handleToggleFavorite}
                onOpenRecipe={() => handleOpenRecipe(recipe.id)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default PopularRecipes;
