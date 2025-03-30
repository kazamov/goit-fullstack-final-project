import type { ReactNode } from 'react';

import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import Paging from '../../../ui/Paging/Paging';
import { UsersList } from '../../UsersList/UsersList';

import styles from './UsersTabContent.module.css';

interface UsersTabContentProps {
  users: (UserFollower | UserFollowing)[] | null;
  emptyContentTemplate: (className: string) => ReactNode;
  totalPages: number;
  onUserChange: (newUser: UserFollower | UserFollowing) => void;
}

export function UsersTabContent({
  users,
  emptyContentTemplate,
  totalPages,
  onUserChange,
}: UsersTabContentProps) {
  if (!users) {
    return <p>Loading...</p>;
  }

  if (users.length === 0) {
    return emptyContentTemplate(styles.noUsers);
  }

  return (
    <>
      <UsersList users={users} onUserChange={onUserChange} />
      {totalPages > 1 && <Paging totalPages={totalPages} />}
    </>
  );
}
