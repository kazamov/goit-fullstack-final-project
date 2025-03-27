import type { FC, MouseEvent, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import type { ModalType } from '../../../redux/ui/slice';
import {
  createModalStateSelector,
  setModalOpened,
} from '../../../redux/ui/slice';

import styles from './Modal.module.css';

export interface ModalRef {
  close: () => void;
}

interface ModalProps {
  type: ModalType;
  children: ReactNode;
  headerContent?: () => ReactNode;
  fullScreen?: boolean;
}

export const Modal: FC<ModalProps> = ({
  type,
  children,
  headerContent,
  fullScreen,
}) => {
  const dispatch = useDispatch();
  const selectModalState = useMemo(
    () => createModalStateSelector(type),
    [type],
  );
  const isOpenedRef = useRef(false);

  const isModalOpened = useSelector(selectModalState);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleClose = useCallback(() => {
    dispatch(setModalOpened({ modal: type, opened: false }));
  }, [dispatch, type]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const dialog = dialogRef.current;
      if (dialog) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          handleClose();
        }
      }
    },
    [handleClose],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isModalOpened) {
      if (!isOpenedRef.current) {
        dialog.showModal();
        isOpenedRef.current = true;
      }
    } else {
      if (isOpenedRef.current) {
        dialog.close();
        isOpenedRef.current = false;
      }
    }
  }, [isModalOpened]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx({ [styles.fullScreen]: fullScreen }, styles.modal)}
      onClick={handleClickOutside}
      onClose={handleClose}
    >
      <div>
        {headerContent?.()}
        <button
          className={styles.closeButton}
          onClick={handleClose}
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
