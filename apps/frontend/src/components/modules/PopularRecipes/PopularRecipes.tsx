import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeShort,
  GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

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
    if (isUserLoggedIn) {
      fetch('/api/users/favorites')
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          setFavorites(GetPaginatedRecipeShortSchema.parse(data));
        })
        .catch((error) => {
          console.error(
            'There has been a problem with your fetch operation:',
            error,
          );
        });
    }
  }, [isUserLoggedIn]);

  const handleOpenProfile = (userId: string) => {
    if (isUserLoggedIn) {
      navigate(`/user/${userId}`);
    } else {
      console.log('You need to login first!');
      // TODO: Відкриття модального вікна login
    }
  };

  const handleToggleFavorite = (recipeId: string, newState: boolean) => {
    if (isUserLoggedIn) {
      // Fetch favorites update only if user is logged in
      fetch(`/api/recipes/${recipeId}/favorite`, {
        method: newState ? 'POST' : 'DELETE',
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Something went wrong');
          }
          setFavorites((prev) => {
            if (newState) {
              // Find recipe in the list
              const foundRecipe = recipes.find((r) => r.id === recipeId);

              // If not found — no actions
              if (!foundRecipe) {
                return prev;
              }

              // Create short recipe
              const shortRecipe = {
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

            // If newState = false — remove recipe
            return {
              ...prev,
              items: prev.items.filter((item) => item.id !== recipeId),
            };
          });
        })
        .catch((error) => {
          console.error('Error updating favorites:', error);
        });
    } else {
      console.log('You need to login first!');
      // TODO: Відкриття модального вікна login
    }
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
