import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import type { UserShortDetails } from '@goit-fullstack-final-project/schemas';

import { selectCurrentUser } from '../../../redux/users/selectors';

export function useUserId() {
  const currentUser = useSelector(selectCurrentUser) as UserShortDetails;
  const params = useParams();

  return params.userId ?? currentUser.id;
}
