import ConfirmationModal from '../../../ui/ConfirmationModal/ConfirmationModal';

interface ModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const LogOutModal = ({ isOpen, onConfirm, onClose }: ModalProps) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      onConfirm={onConfirm}
      onClose={onClose}
      confirmButtonTitle="Log out"
      title="Are you logging out?"
      additionlText="You can always log back in at my time."
    />
  );
};

export default LogOutModal;
