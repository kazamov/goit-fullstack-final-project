import type { ReactNode } from 'react';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import Paging from '../../../ui/Paging/Paging';
import { UsersList } from '../../UsersList/UsersList';

interface UsersTabContentProps {
  users: (UserFollower | UserFollowing)[] | null;
  emptyContentTemplate: ReactNode;
  pagination: {
    page: number;
    totalPages: number;
  };
  onUserChange: (newUser: UserFollower | UserFollowing) => void;
}

export function UsersTabContent({
  users,
  emptyContentTemplate,
  onUserChange,
  pagination,
}: UsersTabContentProps) {
  if (!users) {
    return <p>Loading...</p>;
  }

  if (users.length === 0) {
    return emptyContentTemplate;
  }

  return (
    <>
      <UsersList users={users} onUserChange={onUserChange} />
      {pagination.totalPages > 1 && <Paging totalPages={10} />}
    </>
  );
}
