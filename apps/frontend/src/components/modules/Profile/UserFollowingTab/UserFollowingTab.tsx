import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';
import { UserFollowingsSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { UsersList } from '../../UsersList/UsersList';

interface UserFollowingTabProps {
  userId: string;
}

export function UserFollowingTab({ userId }: UserFollowingTabProps) {
  const [userFollowing, setUserFollowing] = useState<UserFollowing[] | null>(
    null,
  );

  const handleUserChange = useCallback((updatedUser: UserFollowing) => {
    if (updatedUser.following) {
      return;
    }

    setUserFollowing((prevUsers) => {
      return prevUsers?.filter((user) => user.id !== updatedUser.id) ?? null;
    });
  }, []);

  useEffect(() => {
    const fetchUserFollowing = async () => {
      const [error, data] = await tryCatch(
        get<UserFollower[]>(`/api/users/${userId}/followings`, {
          schema: UserFollowingsSchema,
        }),
      );

      if (error) {
        toast.error(error.message);
        setUserFollowing([]);
        return;
      }

      setUserFollowing(data);
    };

    fetchUserFollowing();
  }, [userId]);

  if (!userFollowing) {
    return <p>Loading...</p>;
  }

  if (userFollowing.length === 0) {
    return (
      <p>
        Your account currently has no subscriptions to other users. Learn more
        about our users and select those whose content interests you.
      </p>
    );
  }

  return <UsersList users={userFollowing} onUserChange={handleUserChange} />;
}
