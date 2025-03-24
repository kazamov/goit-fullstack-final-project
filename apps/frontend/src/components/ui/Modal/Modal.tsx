import type { FC, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  headerContent?: () => ReactNode;
  fullScreen?: boolean;
}

interface CloseIconProps {
  className?: string;
}

const CloseIcon: FC<CloseIconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Modal: FC<ModalProps> = ({
  isOpen,
  headerContent,
  fullScreen,
  onClose,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx({ [styles.fullScreen]: fullScreen }, styles.modal)}
    >
      <div>
        {headerContent?.()}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          <CloseIcon className={styles.icon} />
        </button>
      </div>
      {children}
    </dialog>
  );
};

export default Modal;
