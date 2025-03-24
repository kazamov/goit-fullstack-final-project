import clsx from 'clsx';

import type { GetCategoryResponse } from '@goit-fullstack-final-project/schemas';

import type { SelectedCategory } from '../../../redux/categories/slice';
import Container from '../../layout/Container/Container';
import MainTitle from '../../ui/MainTitle/MainTitle';
import SubTitle from '../../ui/SubTitle/SubTitle';

import CategoryList from './CategoryList/CategoryList';

import styles from './Categories.module.css';

interface CategoriesProps {
  categories: GetCategoryResponse;
  onCategorySelect: (categry: SelectedCategory) => void;
}

const Categories = ({ categories, onCategorySelect }: CategoriesProps) => {
  return (
    <section id="categories">
      <Container>
        <div className={clsx(styles.wrapper)}>
          <MainTitle title="Categories" />
          <SubTitle title="Discover a limitless world of culinary possibilities and enjoy exquisite recipes that combine taste, style and the warm atmosphere of the kitchen." />
        </div>
        <CategoryList
          categories={categories}
          onCategorySelect={onCategorySelect}
        />
      </Container>
    </section>
  );
};

export default Categories;
