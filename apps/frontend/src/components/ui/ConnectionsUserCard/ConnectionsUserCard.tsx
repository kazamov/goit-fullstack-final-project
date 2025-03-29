import type { FC } from 'react';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../helpers/catchError';
import { del, post } from '../../../helpers/http';
import Button from '../Button/Button';
import ButtonWithIcon from '../ButtonWithIcon/ButtonWithIcon';

import styles from './ConnectionsUserCard.module.css';

interface ConnectionsUserCardProps {
  user: UserFollower | UserFollowing;
  onUserChange: (newUser: UserFollower | UserFollowing) => void;
}

const ConnectionsUserCard: FC<ConnectionsUserCardProps> = ({
  user,
  onUserChange,
}) => {
  const { id, name, avatarUrl, recipesCount, recipes, following } = user;

  const navigate = useNavigate();

  const navigateToUser = useCallback(() => {
    navigate(`/user/${id}`);
  }, [id, navigate]);

  const handleFollowing = useCallback(async () => {
    const [error] = await tryCatch(
      user.following
        ? del(`/users/${user.id}/follow`)
        : post(`/users/${user.id}/follow`, null),
    );
    if (error) {
      toast.error(error.message);
      return;
    }

    onUserChange({ ...user, following: !following });
  }, [following, onUserChange, user]);

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
            clickHandler={handleFollowing}
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
          clickHandler={navigateToUser}
        />
      </div>
    </div>
  );
};

export default ConnectionsUserCard;
