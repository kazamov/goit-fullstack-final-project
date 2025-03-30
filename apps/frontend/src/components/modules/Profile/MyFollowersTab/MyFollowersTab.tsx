import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import type {
  PaginatedUserFollowers,
  UserFollower,
} from '@goit-fullstack-final-project/schemas';
import { PaginatedUserFollowersSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import { usePagingParams } from '../../../../hooks/usePagingParams';
import type { AppDispatch } from '../../../../redux/store';
import { selectCurrentUserId } from '../../../../redux/users/selectors';
import { fetchProfileDetails } from '../../../../redux/users/slice';
import { UsersTabContent } from '../UsersTabContent/UsersTabContent';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyFollowersTab() {
  const id = useSelector(selectCurrentUserId) as string;
  const dispatch = useDispatch<AppDispatch>();
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [userFollowers, setUserFollowers] = useState<UserFollower[] | null>(
    null,
  );
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleUserChange = useCallback(
    (updatedUser: UserFollower) => {
      setUserFollowers((prevUsers) => {
        return (
          prevUsers?.map((user) =>
            user.id === updatedUser.id ? updatedUser : user,
          ) ?? null
        );
      });

      dispatch(fetchProfileDetails(id));
    },
    [dispatch, id],
  );

  useEffect(() => {
    const fetchUserFollowers = async () => {
      const [error, data] = await tryCatch(
        get<PaginatedUserFollowers>(
          `/api/users/${id}/followers?page=${page}&perPage=${perPage}`,
          {
            schema: PaginatedUserFollowersSchema,
          },
        ),
      );

      if (error) {
        toast.error(error.message);
        setUserFollowers([]);
        return;
      }

      setUserFollowers(data.items);
      setTotalPages(data.totalPages);
    };

    fetchUserFollowers();
  }, [id, page, perPage]);

  const emptyContentTemplate = useCallback((className: string) => {
    return (
      <p className={className}>
        There are currently no followers on your account. Please engage our
        visitors with interesting content and draw their attention to your
        profile.
      </p>
    );
  }, []);

  return (
    <UsersTabContent
      users={userFollowers}
      emptyContentTemplate={emptyContentTemplate}
      totalPages={totalPages}
      onUserChange={handleUserChange}
    />
  );
}

export default MyFollowersTab;
