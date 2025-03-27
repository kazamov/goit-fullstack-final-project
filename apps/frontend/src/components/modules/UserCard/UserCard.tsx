import defaultAvatar from '../../../assets/default-avatar.png';

import styles from './UserCard.module.css';

interface UserCardProps {
  avatar?: string;
  name: string;
  email: string;
  recipesCount: number;
  favoritesCount: number;
  followersCount: number;
  followingCount: number;
}

export const UserCard = ({
  avatar,
  name,
  email,
  recipesCount,
  favoritesCount,
  followersCount,
  followingCount,
}: UserCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <img
          src={avatar || defaultAvatar}
          alt={`${name}'s avatar`}
          className={styles.avatar}
        />
        <button className={styles.avatarButton}>+</button>
      </div>

      <h2 className={styles.name}>{name}</h2>

      <div className={styles.content}>
        <p className={styles.emailRow}>
          Email: <span>{email}</span>
        </p>
        <p>
          Added recipes: <span>{recipesCount}</span>
        </p>
        <p>
          Favorites: <span>{favoritesCount}</span>
        </p>
        <p>
          Followers: <span>{followersCount}</span>
        </p>
        <p>
          Following: <span>{followingCount}</span>
        </p>
      </div>
    </div>
  );
};
