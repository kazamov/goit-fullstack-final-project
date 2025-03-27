import Button from '../../../ui/Button/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalTitle from '../../../ui/ModalTitle/ModalTitle';
import SignInForm from '../SignInForm/SignInForm';

import styles from './SignInModal.module.css';

interface ModalProps {
  onRedirectToSignUp: () => void;
}

const SignInModal = ({ onRedirectToSignUp }: ModalProps) => {
  return (
    <Modal type="login">
      <div className={styles.titleContainer}>
        <ModalTitle title="Sign in" />
      </div>
      <div className={styles.formContainer}>
        <SignInForm />
      </div>
      <div className={styles.buttonContainer}>
        <span className={styles.modalHint}> Don't have an account? </span>
        <Button kind="text" type="button" clickHandler={onRedirectToSignUp}>
          Create account
        </Button>
      </div>
    </Modal>
  );
};

export default SignInModal;
