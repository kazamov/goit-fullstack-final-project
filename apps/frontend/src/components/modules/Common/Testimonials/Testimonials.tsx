import type { FC } from 'react';
import clsx from 'clsx';
import { Autoplay, Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import type { GetTestimonialResponse } from '@goit-fullstack-final-project/schemas';

import 'swiper/css';
import 'swiper/css/pagination';

import Container from '../../../layout/Container/Container';
import MainTitle from '../../../ui/MainTitle/MainTitle';
import SubTitle from '../../../ui/SubTitle/SubTitle';

import styles from './Testimonials.module.css';

interface TestimonialsProps {
  testimonials: GetTestimonialResponse;
}

const Testimonials: FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section id="testimonials" className={clsx(styles.section)}>
      <Container>
        <div className={clsx(styles.wrapper)}>
          <SubTitle
            title="What our customer say"
            className="testimonialsSubTitle"
          />
          <MainTitle title="Testimonials" className="testimonialsMainTitle" />
          <svg className={clsx(styles.icon)}>
            <use href={`/images/icons.svg#icon-quotes`} />
          </svg>
          <Swiper
            spaceBetween={30}
            centeredSlides
            loop
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            mousewheel
            navigation
            modules={[Autoplay, Pagination, Mousewheel]}
            className={clsx(styles.swiper)}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide
                key={index}
                className={clsx(styles.testimonialsItem)}
              >
                <p className={clsx(styles.testimonialsText)}>
                  {testimonial.text}
                </p>
                <p className={clsx(styles.testimonialsAuthor)}>
                  {testimonial.user.name}
                </p>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
