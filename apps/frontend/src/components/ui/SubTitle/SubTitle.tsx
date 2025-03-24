import clsx from 'clsx';

import styles from './SubTitle.module.css';

interface SubTitleProps {
  title: string;
  className?: string;
}

const SubTitle = ({ title, className = '' }: SubTitleProps) => {
  return <h3 className={clsx(styles.subTitle, styles[className])}>{title}</h3>;
};

export default SubTitle;
