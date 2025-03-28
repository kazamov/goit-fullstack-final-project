import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { AppDispatch } from '../../../../redux/store';
import { setModalOpened } from '../../../../redux/ui/slice';
import { selectCurrentUser } from '../../../../redux/users/selectors';
import Button from '../../../ui/Button/Button';

import HeroImages from './HeroImages';

import styles from './Hero.module.css';

const Hero = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const currentUser = useSelector(selectCurrentUser);

  const openSignInModal = useCallback(() => {
    dispatch(setModalOpened({ modal: 'login', opened: true }));
  }, [dispatch]);

  const handleAddRecipeClick = () => {
    const redirectUrl = '/recipes/add';
    if (currentUser) {
      navigate(redirectUrl);
    } else {
      setSearchParams(
        {
          redirect_url: redirectUrl,
        },
        {
          replace: true,
        },
      );

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
        <Button
          kind="primary"
          type="button"
          clickHandler={handleAddRecipeClick}
          className="buttonHero"
        >
          Add Recipe
        </Button>
        <HeroImages />
      </div>
    </div>
  );
};

export default Hero;
