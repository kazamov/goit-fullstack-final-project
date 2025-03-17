import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/home/home';
import { Layout } from './routes/layout';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Routes will be defined here
      { index: true, element: <Home /> },
      { path: '/recipe/:id', element: <div>RecipePage</div> },
      { path: '/recipe/add', element: <div>AddRecipePage</div> },
      { path: '/user/:id', element: <div>UserPage</div> },
    ],
  },
]);

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
