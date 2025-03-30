import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import type { GetRecipeShort } from '@goit-fullstack-final-project/schemas';

import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';
import Paging from '../../../ui/Paging/Paging';

import styles from './RecipesTabContent.module.css';

interface RecipesTabContentProps {
  recipes: GetRecipeShort[] | null;
  totalPages: number;
  actionButtons?: (recipeId: string) => ReactNode;
}

export function RecipesTabContent({
  recipes,
  actionButtons,
  totalPages,
}: RecipesTabContentProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (!recipes) {
    return <p>Loading...</p>;
  }

  if (recipes.length === 0) {
    return (
      <p className={styles.noRecipes}>
        Nothing has been added to your recipes list yet. Please browse our
        recipes and add your favorites for easy access in the future.
      </p>
    );
  }

  return (
    <div className={styles.tabWrapper}>
      <div className={styles.recipeTab}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className={styles.recipeItem}>
            <img
              src={recipe.thumb}
              alt={recipe.title}
              className={styles.recipeImage}
            />
            <div className={styles.recipeWrapper}>
              <div className={styles.recipeDetails}>
                <h3 className={clsx(styles.recipeTitle)}>{recipe.title}</h3>
                <p className={clsx(styles.recipeDescription)}>
                  {recipe.description}
                </p>
              </div>
              <div className={styles.recipeActions}>
                <Link to={`/recipes/${recipe.id}`}>
                  <ButtonWithIcon
                    kind="secondary"
                    type="submit"
                    iconType="icon-arrow-up-right"
                    size={isMobile ? 'small' : 'medium'}
                    aria-label="Open recipe"
                  />
                </Link>
                {actionButtons?.(recipe.id)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.paginationBlock}>
          <Paging totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}
