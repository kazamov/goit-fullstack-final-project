import type { FC, ReactNode } from 'react';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  headerContent?: () => ReactNode;
  fullScreen?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  headerContent,
  fullScreen,
  onClose,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleCloseDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.close();
    }
  }, []);

  const handleAnimationEnd = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      onClose();
    }
  }, [onClose]);

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
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!fullScreen) {
      return;
    }

    if (isOpen) {
      document.body.style.overflow = 'clip';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen, isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx({ [styles.fullScreen]: fullScreen }, styles.modal)}
      onAnimationEnd={handleAnimationEnd}
    >
      <div>
        {headerContent?.()}
        <button
          className={styles.closeButton}
          onClick={handleCloseDialog}
          aria-label="Close modal"
        >
          <svg className={styles.icon}>
            <use href="/images/icons.svg#icon-close" />
          </svg>
        </button>
      </div>
      {children}
    </dialog>
  );
};

export default Modal;
