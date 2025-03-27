import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../../../../redux/store';
import { setModalOpened } from '../../../../redux/ui/slice';
import ButtonHero from '../../../ui/ButtonHero/ButtonHero';
import SignInModal from '../../Auth/SignInModal/SignInModal';
import SignUpModal from '../../Auth/SignUpModal/SignUpModal';

import styles from './Hero.module.css';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector(
    (state: RootState) => state.users.currentUser,
  );

  const openSignInModal = useCallback(() => {
    dispatch(setModalOpened({ modal: 'login', opened: true }));
  }, [dispatch]);

  const openSignUpModal = useCallback(() => {
    dispatch(setModalOpened({ modal: 'register', opened: true }));
  }, [dispatch]);

  const handleAddRecipeClick = () => {
    if (currentUser) {
      navigate('/recipe/add');
    } else {
      openSignInModal();
    }
  };

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroHeader}>Improve Your Culinary Talents</h1>
        <p className={styles.heroDescription}>
          Amazing recipes for beginners in the world of cooking, enveloping you
          in the aromas and tastes of various cuisines.
        </p>
        <ButtonHero
          kind="primary"
          type="button"
          clickHandler={handleAddRecipeClick}
        >
          Add recipe
        </ButtonHero>

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
      </div>

      {/* Modals are always mounted and controlled via Redux */}
      <SignInModal onRedirectToSignUp={openSignUpModal} />
      <SignUpModal onRedirectToSignIn={openSignInModal} />
    </div>
  );
};

export default Hero;
