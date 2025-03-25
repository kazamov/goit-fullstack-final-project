import type { FC } from 'react';
import { useState } from 'react';
import clsx from 'clsx';

import type { GetRecipeResponse } from '@goit-fullstack-final-project/schemas';

import { useMediaQuery } from '../../../hooks/useMediaQuery';
import ButtonWithIcon from '../ButtonWithIcon/ButtonWithIcon';

import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: GetRecipeResponse;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string, newState: boolean) => void;
  onOpenProfile?: (ownerId: string) => void;
  onOpenRecipe?: (recipeId: string) => void;
}

const RecipeCard: FC<RecipeCardProps> = ({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onOpenProfile,
  onOpenRecipe,
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const isMobile = useMediaQuery('(max-width: 767px)');

  const handleToggleFavorite = () => {
    const newState = !favorite;
    setFavorite(newState);

    if (onToggleFavorite) {
      onToggleFavorite(recipe.id, newState);
    }
  };

  const handleOpenProfile = () => {
    if (onOpenProfile) {
      onOpenProfile(recipe.owner.userId);
    }
  };

  const handleOpenRecipe = () => {
    if (onOpenRecipe) {
      onOpenRecipe(recipe.id);
    }
  };

  return (
    <div className={clsx(styles.card)}>
      {/* Recipe image */}
      <img
        src={recipe.thumb}
        alt={recipe.title}
        className={clsx(styles.image)}
      />

      {/* Recipe title */}
      <h3 className={clsx(styles.title)}>{recipe.title}</h3>

      {/* Recipe description */}
      <p className={clsx(styles.description)}>{recipe.description}</p>

      {/* Bottom part of an avatar with buttons */}
      <div className={clsx(styles.footer)}>
        {/* Avatar with name */}
        <div className={clsx(styles.owner)} onClick={handleOpenProfile}>
          <img
            src={recipe.owner.avatarUrl}
            alt={recipe.owner.name}
            className={clsx(styles.avatar)}
          />
          <span className={clsx(styles.ownerName)}>{recipe.owner.name}</span>
        </div>

        {/* Buttons (heart, arrow) */}
        <div className={clsx(styles.actions)}>
          {/* heard button */}
          <ButtonWithIcon
            kind={isFavorite ? 'primary' : 'secondary'}
            type="submit"
            iconType="icon-heart"
            size={isMobile ? 'small' : 'medium'}
            aria-label="Add to favorites"
            clickHandler={handleToggleFavorite}
          />

          {/* Arrow button */}
          <ButtonWithIcon
            kind="secondary"
            type="submit"
            iconType="icon-arrow-up-right"
            size={isMobile ? 'small' : 'medium'}
            aria-label="Open recipe"
            clickHandler={handleOpenRecipe}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
