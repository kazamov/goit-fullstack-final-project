import Logo from '../../ui/Logo/Logo';

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Logo isInversed={false} />

        <ul className={styles.socialList}>
          <li>
            <a
              href="https://www.facebook.com/goITclub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg className={styles.icon}>
                <use href="/src/images/icons.svg#icon-facebook" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://www.instagram.com/goitclub/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg className={styles.icon}>
                <use href="/src/images/icons.svg#icon-instagram" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/c/GoIT"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <svg className={styles.icon}>
                <use href="/src/images/icons.svg#icon-youtube" />
              </svg>
            </a>
          </li>
        </ul>
      </div>

      <hr className={styles.separator} />

      <p className={styles.footerText}>@2024, Foodies. All rights reserved</p>
    </footer>
  );
};

export default Footer;
