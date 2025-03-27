import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Categories from '../../components/modules/Categories/Categories';
import Hero from '../../components/modules/Common/Hero/Hero';
import Testimonials from '../../components/modules/Common/Testimonials/Testimonials';
import Recipes from '../../components/modules/Recipes/Recipes';
import {
  selectCategories,
  selectCurrentCategory,
} from '../../redux/categories/selectors';
import type { SelectedCategory } from '../../redux/categories/slice';
import {
  fetchCategories,
  resetCategory,
  selectCategory,
} from '../../redux/categories/slice';
import type { AppDispatch } from '../../redux/store';
import { selectTestimonials } from '../../redux/testimonials/selectors';
import { fetchTestimonials } from '../../redux/testimonials/slice';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const testimonials = useSelector(selectTestimonials);
  const categories = useSelector(selectCategories);
  const onCategorySelect = (category: SelectedCategory) => {
    dispatch(selectCategory(category));
  };

  const selectedCategory = useSelector(selectCurrentCategory);

  useEffect(() => {
    dispatch(resetCategory());
    dispatch(fetchTestimonials());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <>
      <Hero />
      {!selectedCategory && (
        <Categories
          onCategorySelect={onCategorySelect}
          categories={categories}
        />
      )}
      {selectedCategory && <Recipes category={selectedCategory} />}
      <Testimonials testimonials={testimonials} />
    </>
  );
};

export default HomePage;
