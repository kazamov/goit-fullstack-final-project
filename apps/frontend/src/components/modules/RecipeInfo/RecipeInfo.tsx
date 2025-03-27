import type { FC } from 'react';
import clsx from 'clsx';

import type { GetRecipeDetailedResponse } from '@goit-fullstack-final-project/schemas';

import RecipeIngredients from './RecipeIngredients/RecipeIngredients';
import RecipeMainInfo from './RecipeMainInfo/RecipeMainInfo';
import RecipePreparation from './RecipePreparation/RecipePreparation';

import styles from './RecipeInfo.module.css';

interface RecipeInfoProps {
  recipe: GetRecipeDetailedResponse;
  onOpenProfile: (userId: string) => void;
  onToggleFavorite: (recipeId: string, newState: boolean) => void;
  isFavorite: boolean;
}

export const RecipeInfo: FC<RecipeInfoProps> = ({
  recipe,
  onOpenProfile,
  onToggleFavorite,
  isFavorite,
}) => {
  const { thumb, title } = recipe;
  return (
    <section id="recipeInfo" className={clsx(styles.recipeInfo)}>
      <img src={thumb} alt={title} className={clsx(styles.recipeImage)} />
      <div className={clsx(styles.recipeInfoDescription)}>
        <RecipeMainInfo recipe={recipe} onOpenProfile={onOpenProfile} />
        <RecipeIngredients ingredients={recipe.ingredients} />
        <RecipePreparation
          instructions={recipe.instructions}
          recipeId={recipe.id}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </section>
  );
};

export default RecipeInfo;
