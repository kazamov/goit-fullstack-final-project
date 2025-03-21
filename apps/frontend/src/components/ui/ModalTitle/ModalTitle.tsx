import styles from './ModalTitle.module.css';

interface ModalTitleProps {
  title: string;
}

const ModalTitle = ({ title }: ModalTitleProps) => {
  return <h2 className={styles.modalTitle}>{title}</h2>;
};

export default ModalTitle;
