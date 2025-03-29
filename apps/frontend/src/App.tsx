import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import HomePage from './pages/HomePage/HomePage';
import { Layout } from './routes/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    HydrateFallback: () => <div>Loading...</div>,
    errorElement: <div>Something went wrong</div>,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/recipes',
        lazy: async () => {
          const { default: Component } = await import(
            './pages/Recipes/RecipesPage'
          );
          return {
            Component,
          };
        },
      },
      {
        path: '/recipes/:id',
        lazy: async () => {
          const { default: Component } = await import(
            './pages/RecipePage/RecipePage'
          );
          return {
            Component,
          };
        },
      },
      {
        path: '/recipes/add',
        lazy: async () => {
          const { default: AddRecipePage } = await import(
            './pages/AddRecipePage/AddRecipePage'
          );
          return {
            Component: () => (
              <ProtectedRoute>
                <AddRecipePage />
              </ProtectedRoute>
            ),
          };
        },
      },
      {
        path: '/user/:id',
        lazy: async () => {
          const { default: UserPage } = await import(
            './pages/UserPage/UserPage'
          );
          return {
            Component: () => (
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            ),
          };
        },
      },
    ],
  },
  {
    path: '/kit',
    lazy: async () => {
      const { default: Component } = await import(
        './pages/UIKitPage/UIKitPage'
      );
      return {
        Component,
      };
    },
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
