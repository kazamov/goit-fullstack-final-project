import clsx from 'clsx';

import styles from './MainTitle.module.css';

interface MainTitleProps {
  title: string;
  className?: string;
}

const MainTitle = ({ title, className = '' }: MainTitleProps) => {
  return <h2 className={clsx(styles.mainTitle, styles[className])}>{title}</h2>;
};

export default MainTitle;
