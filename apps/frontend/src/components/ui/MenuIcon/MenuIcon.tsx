import styles from './MenuIcon.module.css';

interface MenuIconProps {
  onClick: () => void;
  children: React.ReactNode;
}

const MenuIcon: React.FC<MenuIconProps> = ({ onClick, children }) => {
  return (
    <button className={styles.menuIconButton} onClick={onClick} type="button">
      {children}
    </button>
  );
};

export default MenuIcon;
