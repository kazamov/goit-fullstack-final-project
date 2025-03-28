import type { FC } from 'react';
import clsx from 'clsx';

import type {
  GetPaginatedRecipeResponse,
  GetPaginatedRecipeShort,
} from '@goit-fullstack-final-project/schemas';

import RecipeCard from '../../../ui/RecipeCard/RecipeCard';

import { RecipePagination } from './RecipePagination/RecipePagination';

import styles from './RecipeList.module.css';

interface RecipeListProps {
  recipes: GetPaginatedRecipeResponse;
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
    <div className={clsx(styles.recipeListContainer)} id="recipeListContainer">
      <ul className={clsx(styles.list)}>
        {recipes.items.map((recipe) => (
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
      <RecipePagination totalPages={recipes.totalPages} />
    </div>
  );
};

export default RecipeList;
