import type { FC } from 'react';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import Button from '../Button/Button';

import styles from './ConnectionsUserCard.module.css';

interface ConnectionsUserCardProps {
  user: UserFollower | UserFollowing;
}

const ConnectionsUserCard: FC<ConnectionsUserCardProps> = ({ user }) => {
  const { id, name, avatarUrl, recipesCount } = user;

  return (
    <div className={styles.card}>
      <img src={avatarUrl} alt={`${name}'s avatar`} className={styles.avatar} />
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.recipes}>Own recipes: {recipesCount}</p>
        <Button
          kind="secondary"
          type="button"
          clickHandler={() => console.log(`Follow user ${id}`)}
          className={styles.button}
          size="small"
        >
          {user.following ? 'Following' : 'Follow'}
        </Button>
      </div>
    </div>
  );
};

export default ConnectionsUserCard;
