import styles from './SubTitle.module.css';

interface SubTitleProps {
  title: string;
}

const SubTitle = ({ title }: SubTitleProps) => {
  return <h3 className={styles.subTitle}>{title}</h3>;
};

export default SubTitle;
