import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Categories from '../../components/modules/Categories/Categories';
import Hero from '../../components/modules/Common/Hero/Hero';
import Testimonials from '../../components/modules/Common/Testimonials/Testimonials';
import { selectCategories } from '../../redux/categories/selectors';
import type { SelectedCategory } from '../../redux/categories/slice';
import { fetchCategories } from '../../redux/categories/slice';
import type { AppDispatch } from '../../redux/store';
import { selectTestimonials } from '../../redux/testimonials/selectors';
import { fetchTestimonials } from '../../redux/testimonials/slice';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const testimonials = useSelector(selectTestimonials);
  const categories = useSelector(selectCategories);
  const onCategorySelect = useCallback(
    (category: SelectedCategory) => {
      const searchParams = new URLSearchParams({
        categoryId: category.id,
      });
      navigate(`/recipes/?${searchParams.toString()}`, {
        viewTransition: true,
      });
    },
    [navigate],
  );

  useEffect(() => {
    if (testimonials.length === 0) {
      dispatch(fetchTestimonials());
    }
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, testimonials, categories]);

  return (
    <>
      <Hero />
      <Categories onCategorySelect={onCategorySelect} categories={categories} />
      <Testimonials testimonials={testimonials} />
    </>
  );
};

export default HomePage;
