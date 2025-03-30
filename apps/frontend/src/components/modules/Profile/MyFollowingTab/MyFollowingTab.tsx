import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import type {
  PaginatedUserFollowings,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';
import { PaginatedUserFollowingsSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { get } from '../../../../helpers/http';
import type { AppDispatch } from '../../../../redux/store';
import { selectCurrentUserId } from '../../../../redux/users/selectors';
import { fetchProfileDetails } from '../../../../redux/users/slice';
import { usePagingParams } from '../usePagingParams';
import { UsersTabContent } from '../UsersTabContent/UsersTabContent';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyFollowingTab() {
  const id = useSelector(selectCurrentUserId) as string;
  const dispatch = useDispatch<AppDispatch>();
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [userFollowing, setUserFollowing] = useState<UserFollowing[] | null>(
    null,
  );
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUserFollowing = useCallback(async () => {
    const [error, data] = await tryCatch(
      get<PaginatedUserFollowings>(
        `/api/users/${id}/followings?page=${page}&perPage=${perPage}`,
        {
          schema: PaginatedUserFollowingsSchema,
        },
      ),
    );

    if (error) {
      toast.error(error.message);
      setUserFollowing([]);
      return;
    }

    setUserFollowing(data.items);
    setTotalPages(data.totalPages);
  }, [id, page, perPage]);

  const handleUserChange = useCallback(async () => {
    dispatch(fetchProfileDetails(id));
    await fetchUserFollowing();
  }, [dispatch, fetchUserFollowing, id]);

  useEffect(() => {
    fetchUserFollowing();
  }, [fetchUserFollowing]);

  const emptyContentTemplate = useMemo(() => {
    return (
      <p>
        Your account currently has no subscriptions to other users. Learn more
        about our users and select those whose content interests you.
      </p>
    );
  }, []);

  return (
    <UsersTabContent
      users={userFollowing}
      emptyContentTemplate={emptyContentTemplate}
      totalPages={totalPages}
      onUserChange={handleUserChange}
    />
  );
}

export default MyFollowingTab;
