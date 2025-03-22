import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import ModalTitle from '../ModalTitle/ModalTitle';

import styles from './ConfirmationModal.module.css';

interface ModalProps {
  confirmButtonTitle: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  additionlText: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  confirmButtonTitle,
  title,
  additionlText,
}: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <ModalTitle title={title} />
        </div>
        <span className={styles.modalHint}> {additionlText}</span>
        <div className={styles.buttonContainer}>
          <Button kind="primary" type="button" clickHandler={onConfirm}>
            {confirmButtonTitle}
          </Button>
          <Button kind="secondary" type="button" clickHandler={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
