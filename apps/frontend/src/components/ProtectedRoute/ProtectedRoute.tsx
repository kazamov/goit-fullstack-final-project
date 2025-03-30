import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setModalOpened } from '../../redux/ui/slice';
import { selectCurrentUser } from '../../redux/users/selectors';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (currentUser === null) {
      const searchParams = new URLSearchParams();
      searchParams.set('redirect_url', location.pathname);

      navigate(`/?${searchParams.toString()}`, {
        replace: true,
        viewTransition: true,
      });
      dispatch(setModalOpened({ modal: 'login', opened: true }));
    }
  }, [currentUser, navigate, dispatch, location.pathname]);

  return currentUser ? children : null;
};

export default ProtectedRoute;
