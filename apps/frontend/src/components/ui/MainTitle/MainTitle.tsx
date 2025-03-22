import styles from './MainTitle.module.css';

interface MainTitleProps {
  title: string;
}

const MainTitle = ({ title }: MainTitleProps) => {
  return <h2 className={styles.mainTitle}>{title}</h2>;
};

export default MainTitle;
