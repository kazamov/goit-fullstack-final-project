import { type FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import Hero from '../../components/modules/Common/Hero/Hero';
import Testimonials from '../../components/modules/Common/Testimonials/Testimonials';
import Recipes from '../../components/modules/Recipes/Recipes';
import {
  createCategorySelector,
  selectCategories,
} from '../../redux/categories/selectors';
import { fetchCategories } from '../../redux/categories/slice';
import type { AppDispatch } from '../../redux/store';
import { selectTestimonials } from '../../redux/testimonials/selectors';
import { fetchTestimonials } from '../../redux/testimonials/slice';

const RecipesPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(selectCategories);
  const testimonials = useSelector(selectTestimonials);
  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get('categoryId');
  const selectedCategory = useSelector(createCategorySelector(categoryId));

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchCategories());
    }
    if (!testimonials.length) {
      dispatch(fetchTestimonials());
    }
  }, [categories.length, dispatch, testimonials.length]);

  return (
    <>
      <Hero />
      {categories.length > 0 && <Recipes category={selectedCategory} />}
      <Testimonials testimonials={testimonials} />
    </>
  );
};

export default RecipesPage;
