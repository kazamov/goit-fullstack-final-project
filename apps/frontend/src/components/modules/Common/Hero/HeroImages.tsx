import styles from './HeroImages.module.css';

const HeroImages = () => {
  return (
    <div className={styles.imageWrapper}>
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
