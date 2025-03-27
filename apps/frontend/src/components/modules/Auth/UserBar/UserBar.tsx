import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import type { UserShortDetails } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { post } from '../../../../helpers/http';
import { setModalOpened } from '../../../../redux/ui/slice';
import { setCurrentUser } from '../../../../redux/users/slice';
import LogOutModal from '../LogOutModal/LogOutModal';

import styles from './UserBar.module.css';

interface UserBarProps {
  currentUser: UserShortDetails | null;
}

const UserBar: FC<UserBarProps> = ({ currentUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleLogoutClick = useCallback(() => {
    setIsMenuOpen(false);
    dispatch(setModalOpened({ modal: 'logout', opened: true }));
  }, [dispatch]);

  const onConfirm = useCallback(async () => {
    dispatch(setCurrentUser(null));
    dispatch(setModalOpened({ modal: 'logout', opened: false }));
    navigate('/');

    await tryCatch(post('/api/users/logout', {}));
  }, [dispatch, navigate]);

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

  return (
    <>
      {currentUser && (
        <div className={styles.container} ref={menuRef}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="User avatar"
                className={styles.avatar}
              />
            ) : (
              <div className={styles.defaultAvatar}>
                {currentUser.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : 'U'}
              </div>
            )}
            <span className={styles.username}>
              {currentUser.name || 'User'}
            </span>
            <svg
              className={clsx(styles.chevron, { [styles.rotated]: isMenuOpen })}
            >
              <use href={'/images/icons.svg#icon-chevron-down'} />
            </svg>
          </button>

          <ul
            className={clsx(styles.dropdownMenu, {
              [styles.dropdownMenuVisible]: isMenuOpen,
            })}
          >
            <li
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link to={`/user/${currentUser.id}`}>Profile</Link>
            </li>
            <li
              className={styles.menuItem}
              onClick={() => setIsMenuOpen(false)}
            >
              <button
                type="button"
                className={styles.menuButton}
                onClick={handleLogoutClick}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
      <LogOutModal onConfirm={onConfirm} />
    </>
  );
};

export default UserBar;
