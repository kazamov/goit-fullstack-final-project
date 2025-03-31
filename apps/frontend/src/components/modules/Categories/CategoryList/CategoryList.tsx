import clsx from 'clsx';

import type { GetCategoryResponse } from '@goit-fullstack-final-project/schemas';

import type { SelectedCategory } from '../../../../redux/categories/slice';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';

import styles from './CategoryList.module.css';

interface CategoryListProps {
  categories: GetCategoryResponse;
  onCategorySelect: (category: SelectedCategory) => void;
}

const FAKE_CATEGORIES = Array.from({ length: 11 }, (_, index) => ({
  id: `skeleton-${index}`,
}));

const CategoryList = ({ categories, onCategorySelect }: CategoryListProps) => {
  const limit = 11;

  return (
    <ul className={styles.categoryCardContainer}>
      {categories.length === 0 &&
        FAKE_CATEGORIES.map((_, index) => (
          <li
            key={index}
            className={clsx(styles.categoryCard, 'skeleton')}
          ></li>
        ))}

      {categories.slice(0, limit).map((category, index) => (
        <li key={index} className={styles.categoryCard}>
          <img
            src={category.images?.small}
            srcSet={`${category.images?.small} 320w, ${category.images?.medium} 768w, ${category.images?.large} 1440w`} // Define the responsive sizes
            sizes="(max-width: 375px) 320px, 
                   (max-width: 768px) 768px, 
                   (max-width: 1440px) 1440px, 
                   "
            alt={category.name}
            className={styles.categoryCardImage}
          />
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
