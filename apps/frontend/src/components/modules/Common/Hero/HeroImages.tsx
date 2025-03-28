import type { FC } from 'react';
import clsx from 'clsx';

import styles from './HeroImages.module.css';

interface HeroImagesProps {
  className?: string;
}

const HeroImages: FC<HeroImagesProps> = ({ className }) => {
  return (
    <div className={clsx(styles.imageWrapper, className)}>
      <picture className={styles.firstImage}>
        <source
          type="image/webp"
          srcSet="/images/hero/hero-cake.webp 1x, /images/hero/hero-cake@2x.webp 2x"
          media="(max-width: 767px)"
        />
        <img src="/images/hero/hero-cake.webp" alt="Cake on a plate" />
      </picture>

      <picture className={styles.secondImage}>
        <source
          type="image/webp"
          srcSet="/images/hero/hero-meat.webp 1x, /images/hero/hero-meat@2x.webp 2x"
          media="(max-width: 767px)"
        />
        <img src="/images/hero/hero-meat.webp" alt="Meat roll on a plate" />
      </picture>
    </div>
  );
};

export default HeroImages;
