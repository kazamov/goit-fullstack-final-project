import type { ReactNode } from 'react';

import Modal from '../../../ui/Modal/Modal';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
}

const SignUpModal = ({ isOpen, onClose, onSubmit, children }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {children}
    </Modal>
  );
};

export default SignUpModal;
