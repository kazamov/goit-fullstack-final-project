import type { FC } from 'react';

import type { GetRecipeShort } from '@goit-fullstack-final-project/schemas';

import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';

import styles from './RecipeTab.module.css';

interface RecipeCardProps {
  recipeList: GetRecipeShort[];
  handleOpenRecipe?: (recipeId: string) => void;
  handleRemoveRecipe?: (recipeId: string) => void;
  isCurrentUser: boolean;
}

const RecipeTab: FC<RecipeCardProps> = ({
  recipeList,
  handleOpenRecipe,
  handleRemoveRecipe,
  isCurrentUser,
}) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return (
    <div className={styles.recipeTab}>
      {recipeList.length > 0 ? (
        recipeList.map((recipe) => (
          <div key={recipe.id} className={styles.recipeItem}>
            <img
              src={recipe.thumb}
              alt={recipe.title}
              className={styles.recipeImage}
            />
            <div className={styles.recipeWrapper}>
              <div className={styles.recipeDetails}>
                <h3>{recipe.title}</h3>
                <p>{recipe.description}</p>
              </div>
              <div className={styles.recipeActions}>
                <ButtonWithIcon
                  kind="secondary"
                  type="submit"
                  iconType="icon-arrow-up-right"
                  size={isMobile ? 'small' : 'medium'}
                  aria-label="Open recipe"
                  clickHandler={() => handleOpenRecipe?.(recipe.id)}
                />
                {isCurrentUser && (
                  <ButtonWithIcon
                    kind="secondary"
                    type="submit"
                    iconType="icon-trash"
                    size={isMobile ? 'small' : 'medium'}
                    aria-label="Remove from favorites"
                    clickHandler={() => handleRemoveRecipe?.(recipe.id)}
                  />
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noRecipes}>
          Nothing has been added to your recipes list yet. Please browse our
          recipes and add your favorites for easy access in the future.
        </p>
      )}
    </div>
  );
};

export default RecipeTab;
