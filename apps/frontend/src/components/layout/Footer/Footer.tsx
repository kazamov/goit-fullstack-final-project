import Logo from '../../ui/Logo/Logo';
import Container from '../Container/Container';

import Copyright from './Copyright';
import NetworkLinks from './NetworkLinks';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <Logo isInversed={false} />
          <NetworkLinks />
        </div>
      </Container>
      <hr className={styles.separator} />
      <Container>
        <Copyright />
      </Container>
    </footer>
  );
};

export default Footer;
