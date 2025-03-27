import type { FC } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../../../../redux/store';
import { setModalOpened } from '../../../../redux/ui/slice';
import Button from '../../../ui/Button/Button';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';

import styles from './AuthBar.module.css';

interface AuthBarProps {
  userSignedIn: boolean;
}

const AuthBar: FC<AuthBarProps> = ({ userSignedIn }) => {
  const dispatch = useDispatch<AppDispatch>();

  const openSignInModal = useCallback(() => {
    dispatch(setModalOpened({ modal: 'login', opened: true }));
  }, [dispatch]);
  const openSignUpModal = useCallback(() => {
    dispatch(setModalOpened({ modal: 'register', opened: true }));
  }, [dispatch]);

  return (
    <>
      {!userSignedIn && (
        <div className={styles.authBar}>
          <Button
            kind="ghost"
            type="button"
            size="small"
            clickHandler={openSignInModal}
          >
            Sign in
          </Button>
          <Button
            kind="primary"
            type="button"
            size="small"
            clickHandler={openSignUpModal}
          >
            Sign up
          </Button>
        </div>
      )}

      <SignInModal onRedirectToSignUp={openSignUpModal}></SignInModal>
      <SignUpModal onRedirectToSignIn={openSignInModal}></SignUpModal>
    </>
  );
};

export default AuthBar;
