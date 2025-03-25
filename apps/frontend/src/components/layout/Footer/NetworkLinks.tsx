import styles from './Footer.module.css';

const NetworkLinks = () => {
  return (
    <ul className={styles.socialList}>
      <li>
        <a
          href="https://www.facebook.com/goITclub/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <svg className={styles.icon}>
            <use href="/images/icons.svg#icon-facebook" />
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
            <use href="/images/icons.svg#icon-instagram" />
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
            <use href="/images/icons.svg#icon-youtube" />
          </svg>
        </a>
      </li>
    </ul>
  );
};

export default NetworkLinks;
