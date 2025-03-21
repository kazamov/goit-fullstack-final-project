import type { ReactNode } from 'react';

import Modal from '../../../ui/Modal/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const SignInModal = ({ isOpen, onClose, children }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {children}
    </Modal>
  );
};

export default SignInModal;
