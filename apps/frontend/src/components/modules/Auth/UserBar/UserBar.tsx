import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import LogOutModal from '../LogOutModal/LogOutModal';

import styles from './UserBar.module.css';

const user = {
  name: 'John',
  avatar: '',
  id: 1,
};

const UserBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const onConfirm = () => {
    console.log('logout');
  };
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains((event.target as Node) ?? null)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        type="button"
        className={styles.profileButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {user?.avatar ? (
          <img src={user.avatar} alt="User avatar" className={styles.avatar} />
        ) : (
          <div className={styles.defaultAvatar}>{initial}</div>
        )}
        <div>
          <span className={styles.username}>{user?.name || 'User'}</span>
          {/* TO DO: change icon */}
          <span className={styles.chevron}>-</span>
        </div>
      </button>

      {isMenuOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
            <Link to={`/user/${user.id}`}>Profile</Link>
          </li>
          <li className={styles.menuItem} onClick={() => setIsMenuOpen(false)}>
            <button
              type="button"
              className={styles.menuButton}
              onClick={() => setIsLogOutOpen(true)}
            >
              Log Out
            </button>
          </li>
        </ul>
      )}

      <LogOutModal
        isOpen={isLogOutOpen}
        onConfirm={onConfirm}
        onClose={() => setIsLogOutOpen(false)}
      />
    </div>
  );
};

export default UserBar;
