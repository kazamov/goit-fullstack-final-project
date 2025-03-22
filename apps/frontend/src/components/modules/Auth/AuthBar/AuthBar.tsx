import { useState } from 'react';

import Button from '../../../ui/Button/Button';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';

import styles from './AuthBar.module.css';

const AuthBar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const onRedirectToSignIn = () => {
    setIsSignUpOpen(false);
    setIsSignInOpen(true);
  };

  const onRedirectToSignUp = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  return (
    <>
      <div className={styles.authBar}>
        <Button
          kind="ghost"
          type="button"
          size="small"
          clickHandler={() => setIsSignInOpen(true)}
        >
          Sign in
        </Button>
        <Button
          kind="primary"
          type="button"
          size="small"
          clickHandler={() => setIsSignUpOpen(true)}
        >
          Sign up
        </Button>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onRedirectToSignUp={onRedirectToSignUp}
        onClose={() => setIsSignInOpen(false)}
      ></SignInModal>

      <SignUpModal
        isOpen={isSignUpOpen}
        onRedirectToSignIn={onRedirectToSignIn}
        onClose={() => setIsSignUpOpen(false)}
      ></SignUpModal>
    </>
  );
};

export default AuthBar;
