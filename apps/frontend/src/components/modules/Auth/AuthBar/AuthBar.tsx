import { useState } from 'react';

import Button from '../../../ui/Button/Button';
import SignInModal from '../SignInModal/SignInModal';
import SignUpModal from '../SignUpModal/SignUpModal';

import styles from './AuthBar.module.css';

const AuthBar = () => {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const signIn = () => {
    console.log('signIn');
  };
  const signUp = () => {
    console.log('signUp');
  };

  return (
    <>
      <div className={styles.authBar}>
        <Button
          kind="ghost"
          type="submit"
          size="small"
          clickHandler={() => setIsSignInOpen(true)}
        >
          Sign in
        </Button>
        <Button
          kind="primary"
          type="submit"
          size="small"
          clickHandler={() => setIsSignUpOpen(true)}
        >
          Sign up
        </Button>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSubmit={signIn}
      >
        SignInModal
      </SignInModal>

      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSubmit={signUp}
      >
        SignUpModal
      </SignUpModal>
    </>
  );
};

export default AuthBar;
