import { Outlet, useLocation } from 'react-router-dom';

import Footer from '../components/layout/Footer/Footer';
import Header from '../components/layout/Header/Header';

export function Layout() {
  // TO DO: remove after development
  const location = useLocation();
  const isOnlyMain = location.pathname === '/kit';

  return (
    <>
      {!isOnlyMain && <Header />}
      <main>
        <Outlet />
      </main>
      {!isOnlyMain && <Footer />}
    </>
  );
}
