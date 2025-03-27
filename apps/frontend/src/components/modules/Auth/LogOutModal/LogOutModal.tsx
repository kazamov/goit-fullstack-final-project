import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { setModalOpened } from '../../../../redux/ui/slice';
import Button from '../../../ui/Button/Button';
import Modal from '../../../ui/Modal/Modal';
import ModalTitle from '../../../ui/ModalTitle/ModalTitle';

import styles from './LogOutModal.module.css';

interface ModalProps {
  onConfirm: () => void;
}

const LogOutModal = ({ onConfirm }: ModalProps) => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => {
    dispatch(setModalOpened({ modal: 'logout', opened: false }));
  }, [dispatch]);

  return (
    <Modal type="logout">
      <div className={styles.contentContainer}>
        <div className={styles.titleContainer}>
          <ModalTitle title="Are you logging out?" />
        </div>
        <span className={styles.modalHint}>
          You can always log back in at my time.
        </span>
        <div className={styles.buttonContainer}>
          <Button kind="primary" type="button" clickHandler={onConfirm}>
            Log out
          </Button>
          <Button kind="secondary" type="button" clickHandler={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogOutModal;
