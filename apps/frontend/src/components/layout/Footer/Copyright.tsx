import styles from './Footer.module.css';

const currentYear = new Date().getFullYear();

const Copyright = () => {
  return (
    <p className={styles.footerText}>
      @{currentYear}, Foodies. All rights reserved
    </p>
  );
};

export default Copyright;
