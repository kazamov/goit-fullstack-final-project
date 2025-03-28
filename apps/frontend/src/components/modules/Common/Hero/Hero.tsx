import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch } from '../../../../redux/store';
import { setModalOpened } from '../../../../redux/ui/slice';
import { selectCurrentUser } from '../../../../redux/users/selectors';
import ButtonHero from '../../../ui/ButtonHero/ButtonHero';
import SignInModal from '../../Auth/SignInModal/SignInModal';
import SignUpModal from '../../Auth/SignUpModal/SignUpModal';

import HeroImages from './HeroImages';

import styles from './Hero.module.css';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrentUser);

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

        <HeroImages />
      </div>

      {/* Modals are always mounted and controlled via Redux */}
      <SignInModal onRedirectToSignUp={openSignUpModal} />
      <SignUpModal onRedirectToSignIn={openSignInModal} />
    </div>
  );
};

export default Hero;
