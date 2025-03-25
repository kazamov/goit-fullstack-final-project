import clsx from 'clsx';

import type { GetCategoryResponse } from '@goit-fullstack-final-project/schemas';

import type { SelectedCategory } from '../../../../redux/categories/slice';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';

import styles from './CategoryList.module.css';

interface CategoryListProps {
  categories: GetCategoryResponse;
  onCategorySelect: (category: SelectedCategory) => void;
}

const CategoryList = ({ categories, onCategorySelect }: CategoryListProps) => {
  const limit = 11;

  return (
    <ul className={styles.categoryCardContainer}>
      {categories.slice(0, limit).map((category, index) => (
        <li key={index} className={styles.categoryCard}>
          {/* <img
            // src={category.image}
            alt={category.name}
            className={styles.categoryCardImage}
          /> */}
          <div className={styles.categoryCardAction}>
            <span className={styles.categoryCardName}>{category.name}</span>
            <ButtonWithIcon
              kind="ghost"
              size="large"
              type="button"
              iconType="icon-arrow-up-right"
              clickHandler={() => onCategorySelect(category)}
            />
          </div>
        </li>
      ))}
      <li
        className={clsx(styles.categoryCard, styles.defaultCard)}
        onClick={() =>
          onCategorySelect({
            id: '',
            name: 'All Categories',
            description: 'Recipes by All Categories',
          })
        }
      >
        ALL CATEGORIES
      </li>
    </ul>
  );
};

export default CategoryList;
