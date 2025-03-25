import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import Footer from '../components/layout/Footer/Footer';
import Header from '../components/layout/Header/Header';
import type { AppDispatch } from '../redux/store';
import { fetchCurrentUser } from '../redux/users/slice';

export function Layout() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
