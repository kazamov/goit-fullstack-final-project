import type { FC } from 'react';
import clsx from 'clsx';

import type { GetRecipeDetailedResponse } from '@goit-fullstack-final-project/schemas';

import Badge from '../../../ui/Badge/Badge';

import styles from './RecipeMainInfo.module.css';

interface RecipeMainInfoProps {
  recipe: GetRecipeDetailedResponse;
  onOpenProfile: (userId: string) => void;
}

export const RecipeMainInfo: FC<RecipeMainInfoProps> = ({
  recipe,
  onOpenProfile,
}) => {
  const { title, area, category, time, description, owner } = recipe;
  return (
    <div className={clsx(styles.recipeMainInfo)}>
      <h2 className={clsx(styles.recipeMainInfoTitle)}>{title}</h2>
      <div className={clsx(styles.badges)}>
        <Badge text={area.areaName} />
        <Badge text={category.categoryName} />
        <Badge text={`${time.toString()} min`} />
      </div>
      <p className={clsx(styles.recipeMainInfoDescription)}>{description}</p>
      <div
        className={clsx(styles.owner)}
        onClick={() => onOpenProfile(owner.userId)}
      >
        <img
          src={owner.avatarUrl}
          alt={owner.name}
          className={clsx(styles.avatar)}
        />
        <div className={clsx(styles.ownerInfo)}>
          <p className={clsx(styles.createdBy)}>Created by:</p>
          <p className={clsx(styles.ownerName)}>{owner.name}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeMainInfo;
