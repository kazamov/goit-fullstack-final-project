import defaultAvatar from '../../../assets/default-avatar.png';
import UploadButton from '../../ui/UploadButton/UploadButton';

import styles from './UserCard.module.css';

interface UserCardProps {
  avatar?: string;
  name: string;
  email: string;
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
  isCurrentUser: boolean;
  onAvatarChange?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

export const UserCard = ({
  avatar,
  name,
  email,
  recipesCount,
  favoritesCount,
  followersCount,
  followingCount,
  isCurrentUser,
  onAvatarChange,
  isLoading,
}: UserCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img
          src={avatar || defaultAvatar}
          alt={`${name}'s avatar`}
          className={styles.avatar}
        />
        {isCurrentUser && onAvatarChange && (
          <div className={styles.avatarButton}>
            <UploadButton
              isLoading={isLoading ?? false}
              onFileSelect={onAvatarChange}
            />
          </div>
        )}
      </div>

      <h2 className={styles.name}>{name}</h2>

      <div className={styles.content}>
        <p className={styles.emailRow}>
          Email: <span className={styles.emailValue}>{email}</span>
        </p>
        <p className={styles.textRow}>
          Added recipes: <span className={styles.value}>{recipesCount}</span>
        </p>
        {isCurrentUser && (
          <p className={styles.textRow}>
            Favorites: <span className={styles.value}>{favoritesCount}</span>
          </p>
        )}
        <p className={styles.textRow}>
          Followers: <span className={styles.value}>{followersCount}</span>
        </p>
        {isCurrentUser && (
          <p className={styles.textRow}>
            Following: <span className={styles.value}>{followingCount}</span>
          </p>
        )}
      </div>
    </div>
  );
};
