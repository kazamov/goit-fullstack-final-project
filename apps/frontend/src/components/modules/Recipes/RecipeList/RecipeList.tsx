import type { FC } from 'react';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeShort,
  GetRecipeResponse,
} from '@goit-fullstack-final-project/schemas';

import RecipeCard from '../../../ui/RecipeCard/RecipeCard';

import styles from './RecipeList.module.css';

interface RecipeListProps {
  recipes: GetRecipeResponse[];
  favorites: GetPaginatedRecipeShort;
  onOpenProfile: (userId: string) => void;
  onToggleFavorite: (recipeId: string, newState: boolean) => void;
  onOpenRecipe: (recipeId: string) => void;
}

export const RecipeList: FC<RecipeListProps> = ({
  recipes,
  favorites,
  onOpenProfile,
  onToggleFavorite,
  onOpenRecipe,
}) => {
  return (
    <ul className={clsx(styles.list)}>
      {recipes.map((recipe) => (
        <li key={recipe.id} className={clsx(styles.item)}>
          <RecipeCard
            recipe={recipe}
            isFavorite={favorites.items.some((item) => item.id === recipe.id)}
            onOpenProfile={() => onOpenProfile(recipe.owner.userId)}
            onToggleFavorite={onToggleFavorite}
            onOpenRecipe={() => onOpenRecipe(recipe.id)}
          />
        </li>
      ))}
    </ul>
  );
};

export default RecipeList;
