import Button from '../../../ui/Button/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalTitle from '../../../ui/ModalTitle/ModalTitle';
import SignInForm from '../SignInForm/SignInForm';

import styles from './SignInModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRedirectToSignUp: () => void;
}

const SignInModal = ({ isOpen, onClose, onRedirectToSignUp }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
