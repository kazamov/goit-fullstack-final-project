import Logo from '../../ui/Logo/Logo';

import Copyright from './Copyright';
import NetworkLinks from './NetworkLinks';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Logo isInversed={false} />
        <NetworkLinks />
      </div>

      <hr className={styles.separator} />

      <Copyright />
    </footer>
  );
};

export default Footer;
