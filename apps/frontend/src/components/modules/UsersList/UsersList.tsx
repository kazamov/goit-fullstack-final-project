import type {
  UserFollower,
  UserFollowing,
} from '@goit-fullstack-final-project/schemas';

import ConnectionsUserCard from '../../ui/ConnectionsUserCard/ConnectionsUserCard';

import styles from './UsersList.module.css';

interface UsersListProps {
  users: (UserFollower | UserFollowing)[];
  onUserChange: (newUser: UserFollower | UserFollowing) => void;
}

export function UsersList({ users, onUserChange }: UsersListProps) {
  return (
    <ul className={styles.usersList}>
      {users.map((user) => (
        <li key={user.id} className={styles.userListItem}>
          <ConnectionsUserCard user={user} onUserChange={onUserChange} />
        </li>
      ))}
    </ul>
  );
}
