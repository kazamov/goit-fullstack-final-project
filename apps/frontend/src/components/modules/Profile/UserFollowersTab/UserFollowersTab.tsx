import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type { UserFollower } from '@goit-fullstack-final-project/schemas';
import { UserFollowersSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { UsersList } from '../../UsersList/UsersList';

interface UserFollowersTabProps {
  userId: string;
}

export function UserFollowersTab({ userId }: UserFollowersTabProps) {
  const [userFollowers, setUserFollowers] = useState<UserFollower[] | null>(
    null,
  );

  const handleUserChange = useCallback((updatedUser: UserFollower) => {
    setUserFollowers((prevUsers) => {
      return (
        prevUsers?.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ) ?? null
      );
    });
  }, []);

  useEffect(() => {
    const fetchUserFollowers = async () => {
      const [error, data] = await tryCatch(
        get<UserFollower[]>(`/api/users/${userId}/followers`, {
          schema: UserFollowersSchema,
        }),
      );

      if (error) {
        toast.error(error.message);
        setUserFollowers([]);
        return;
      }

      setUserFollowers(data);
    };

    fetchUserFollowers();
  }, [userId]);

  if (!userFollowers) {
    return <p>Loading...</p>;
  }

  if (userFollowers.length === 0) {
    return (
      <p>
        There are currently no followers on your account. Please engage our
        visitors with interesting content and draw their attention to your
        profile.
      </p>
    );
  }

  return <UsersList users={userFollowers} onUserChange={handleUserChange} />;
}
