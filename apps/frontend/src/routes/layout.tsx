import { Outlet } from 'react-router-dom';

import Footer from '../components/layout/Footer/Footer';
import Header from '../components/layout/Header/Header';

export function Layout() {
  return (
    <>
      <Header />
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
