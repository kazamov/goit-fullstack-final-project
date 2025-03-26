import type { FC } from 'react';
import clsx from 'clsx';

import type { GetRecipeDetailedResponse } from '@goit-fullstack-final-project/schemas';

import Button from '../../../ui/Button/Button';

import styles from './RecipePreparation.module.css';

interface RecipePreparationProps {
  instructions: GetRecipeDetailedResponse['instructions'];
  recipeId: string;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string, newState: boolean) => void;
}

export const RecipePreparation: FC<RecipePreparationProps> = ({
  instructions,
  recipeId,
  isFavorite,
  onToggleFavorite,
}) => {
  const instructionList = instructions.split('\r\n');
  return (
    <div className={clsx(styles.wrapper)}>
      <h3 className={clsx(styles.title)}>Recipe Preparation</h3>
      <ul className={clsx(styles.list)}>
        {instructionList.map((instruction, index) => (
          <li key={index} className={clsx(styles.instruction)}>
            {instruction}
          </li>
        ))}
      </ul>
      <Button
        kind={isFavorite ? 'primary' : 'secondary'}
        type="submit"
        clickHandler={() => onToggleFavorite(recipeId, !isFavorite)}
        className="addToFavoritesButton"
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </Button>
    </div>
  );
};

export default RecipePreparation;
