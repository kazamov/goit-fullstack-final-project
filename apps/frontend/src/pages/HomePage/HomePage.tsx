import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Hero from '../../components/modules/Common/Hero/Hero';
import Testimonials from '../../components/modules/Common/Testimonials/Testimonials';
import type { AppDispatch } from '../../redux/store';
import { selectTestimonials } from '../../redux/testimonials/selectors';
import { fetchTestimonials } from '../../redux/testimonials/slice';

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const testimonials = useSelector(selectTestimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);
  return (
    <>
      <Hero />
      <Testimonials testimonials={testimonials} />
    </>
  );
};

export default HomePage;
