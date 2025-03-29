import type { FC } from 'react';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import Button from '../Button/Button';
import ButtonWithIcon from '../ButtonWithIcon/ButtonWithIcon';

import styles from './ConnectionsUserCard.module.css';

interface ConnectionsUserCardProps {
  user: UserFollower | UserFollowing;
}

const ConnectionsUserCard: FC<ConnectionsUserCardProps> = ({ user }) => {
  const { id, name, avatarUrl, recipesCount, recipes } = user;

  return (
    <div className={styles.connectionUserCardContainer}>
      <div className={styles.userCard}>
        <img
          src={avatarUrl}
          alt={`${name}'s avatar`}
          className={styles.avatar}
        />
        <div className={styles.info}>
          <p className={styles.name}>{name}</p>
          <p className={styles.recipes}>Own recipes: {recipesCount}</p>
          <Button
            kind="secondary"
            type="button"
            clickHandler={() => console.log(`Follow user ${id}`)}
            className={styles.button}
            size="xsmall"
          >
            {user.following ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      <div className={styles.recipesBlock}>
        {recipes.slice(0, 4).map((recipe) => (
          <img
            key={recipe.id}
            src={recipe.thumb}
            alt={recipe.title}
            className={styles.recipeThumbnail}
          />
        ))}

        {Array.from({ length: 4 - recipes.length }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className={styles.recipePlaceholder}
          ></div>
        ))}
      </div>

      <div className={styles.buttonBlock}>
        <ButtonWithIcon
          kind="secondary"
          size="medium"
          type="button"
          iconType="icon-arrow-up-right"
        />
      </div>
    </div>
  );
};

export default ConnectionsUserCard;
