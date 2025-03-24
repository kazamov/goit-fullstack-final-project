import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import LogOutModal from '../LogOutModal/LogOutModal';

import styles from './UserBar.module.css';

const user = {
  name: 'John',
  avatar:
    'https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FydG9vbnxlbnwwfHwwfHx8MA%3D%3D',
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
        <span className={styles.username}>{user?.name || 'User'}</span>
        <svg className={styles.chevron}>
          <use
            href={`/src/images/icons.svg#icon-chevron-${isMenuOpen ? 'up' : 'down'}`}
          />
        </svg>
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
