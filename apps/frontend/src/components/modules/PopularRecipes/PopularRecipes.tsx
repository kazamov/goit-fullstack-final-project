import type { FC } from 'react';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeShort,
  GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';

import Container from '../../layout/Container/Container';
import RecipeCard from '../../ui/RecipeCard/RecipeCard';

import styles from './PopularRecipes.module.css';

interface PopularRecipesProps {
  recipes: GetRecipeResponse[];
  favorites: GetPaginatedRecipeShort;
  onOpenProfile: (userId: string) => void;
  onToggleFavorite: (recipeId: string, newState: boolean) => void;
  onOpenRecipe: (recipeId: string) => void;
}

const PopularRecipes: FC<PopularRecipesProps> = ({
  recipes,
  favorites,
  onOpenProfile,
  onToggleFavorite,
  onOpenRecipe,
}) => {
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
                onOpenProfile={() => onOpenProfile(recipe.owner.userId)}
                onToggleFavorite={onToggleFavorite}
                onOpenRecipe={() => onOpenRecipe(recipe.id)}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
};

export default PopularRecipes;
