import type { IngredientCardObject } from '@goit-fullstack-final-project/schemas';

import styles from './IngredientCard.module.css';

const IngredientCard = ({
  ingredient,
  onDelete,
}: {
  ingredient: IngredientCardObject;
  onDelete?: (id: string) => void;
}) => {
  return (
    <div className={styles.ingredientCard}>
      <div className={styles.ingredientImageWrapper}>
        <img
          src={ingredient.imageUrl}
          alt={ingredient.name}
          className={styles.ingredientImage}
        />
      </div>
      <div className={styles.ingredientInfoWrapper}>
        <p className={styles.ingredientTitle}>{ingredient.name}</p>
        <p className={styles.ingredientAmount}>{ingredient.amount}</p>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(ingredient.id)}
          className={styles.deleteButton}
        >
          <svg className={styles.deleteButtonIcon}>
            <use href={`/images/icons.svg#icon-close`}></use>
          </svg>
        </button>
      )}
    </div>
  );
};

export default IngredientCard;
