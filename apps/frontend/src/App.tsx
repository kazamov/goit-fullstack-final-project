import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AddRecipePage from './pages/AddRecipePage/AddRecipePage';
import HomePage from './pages/HomePage/HomePage';
import RecipePage from './pages/RecipePage/RecipePage';
import UserPage from './pages/UserPage/UserPage';
import { Layout } from './routes/layout';

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Routes will be defined here
      { index: true, element: <HomePage /> },
      { path: '/recipe/:id', element: <RecipePage /> },
      { path: '/recipe/add', element: <AddRecipePage /> },
      { path: '/user/:id', element: <UserPage /> },
    ],
  },
  {
    path: '/kit',
    lazy: async () => {
      const { default: Component } = await import(
        './pages/UIKitPage/UIKitPage'
      );
      return { Component };
    },
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
