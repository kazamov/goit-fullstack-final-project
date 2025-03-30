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
        children: [
          {
            path: 'recipes',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/UserRecipesTab/UserRecipesTab'
              );
              return {
                Component,
              };
            },
          },
          {
            path: 'followers',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/UserFollowersTab/UserFollowersTab'
              );
              return {
                Component,
              };
            },
          },
        ],
      },
      {
        path: '/profile',
        lazy: async () => {
          const { default: ProfilePage } = await import(
            './pages/ProfilePage/ProfilePage'
          );
          return {
            Component: () => (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          };
        },
        children: [
          {
            path: 'recipes',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/MyRecipesTab/MyRecipesTab'
              );
              return {
                Component,
              };
            },
          },
          {
            path: 'favorites',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/MyFavoritesTab/MyFavoritesTab'
              );
              return {
                Component,
              };
            },
          },
          {
            path: 'following',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/MyFollowingTab/MyFollowingTab'
              );
              return {
                Component,
              };
            },
          },
          {
            path: 'followers',
            lazy: async () => {
              const { default: Component } = await import(
                './components/modules/Profile/MyFollowersTab/MyFollowersTab'
              );
              return {
                Component,
              };
            },
          },
        ],
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
