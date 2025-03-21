import styles from './BurgerMenuIcon.module.css';

interface BurgerMenuIconProps {
  onClick: () => void;
}

const BurgerMenuIcon: React.FC<BurgerMenuIconProps> = ({ onClick }) => {
  // TO DO: Replace with icon from file
  return (
    <button className={styles.menuIcon} onClick={onClick} type="button">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.5 11.6665H3.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24.5 7H3.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24.5 16.3335H3.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M24.5 21H3.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  );
};

export default BurgerMenuIcon;
