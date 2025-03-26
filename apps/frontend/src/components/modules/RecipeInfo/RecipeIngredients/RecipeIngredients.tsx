import type { FC } from 'react';
import clsx from 'clsx';

import type { GetRecipeDetailedResponse } from '@goit-fullstack-final-project/schemas';

import IngredientCard from '../../../ui/IngredientCard/IngredientCard';

import styles from './RecipeIngredients.module.css';

interface RecipeIngredientsProps {
  ingredients: GetRecipeDetailedResponse['ingredients'];
}

export const RecipeIngredients: FC<RecipeIngredientsProps> = ({
  ingredients,
}) => {
  return (
    <div className={clsx(styles.recipeIngredients)}>
      <h3 className={clsx(styles.recipeIngredientsTitle)}>Ingredients</h3>
      <ul className={clsx(styles.recipeIngredientsList)}>
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className={clsx(styles.recipeIngredientsItem)}
          >
            <IngredientCard ingredient={ingredient} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeIngredients;
