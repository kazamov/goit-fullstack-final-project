import Button from '../../../ui/Button/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalTitle from '../../../ui/ModalTitle/ModalTitle';
import SignUpForm from '../SignUpForm/SignUpForm';

import styles from './SignUpModal.module.css';

interface ModalProps {
  onRedirectToSignIn: () => void;
}

const SignUpModal = ({ onRedirectToSignIn }: ModalProps) => {
  return (
    <Modal type="register">
      <div className={styles.titleContainer}>
        <ModalTitle title="Sign Up" />
      </div>
      <div className={styles.formContainer}>
        <SignUpForm />
      </div>
      <div className={styles.buttonContainer}>
        <span className={styles.modalHint}> I already have an account? </span>
        <Button kind="text" type="button" clickHandler={onRedirectToSignIn}>
          Sign in
        </Button>
      </div>
    </Modal>
  );
};

export default SignUpModal;
