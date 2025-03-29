import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import type {
  GetRecipeShort,
  OtherUserDetails,
} from '@goit-fullstack-final-project/schemas';
import { OtherUserDetailsSchema } from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import RecipeTab from '../../components/modules/Profile/RecipeTab/RecipeTab';
import Button from '../../components/ui/Button/Button';
import { tryCatch } from '../../helpers/catchError';
import { del, get, post } from '../../helpers/http';
import { scrollToElement } from '../../helpers/scrollToTop';
import { selectCurrentUser } from '../../redux/users/selectors';
import { setCurrentUser } from '../../redux/users/slice';

import styles from './UserPage.module.css';

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const { id: userId } = useParams<{ id: string }>();
  const [, setUser] = useState<OtherUserDetails | null>(null);
  const [userRecipesList, setUserRecipesList] = useState<GetRecipeShort[]>([]);
  const [favoriteRecipeList, setFavoriteRecipeList] = useState<
    GetRecipeShort[]
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [recipePagination, setRecipePagination] = useState(() => ({
    page: 1,
    limit: 9,
    totalPages: 1,
  }));

  const [favoritePagination, setFavoritePagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
  });

  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const newParams = new URLSearchParams(prevParams);

        if (!newParams.has('page')) {
          newParams.set('page', '1');
        }
        return newParams;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const currentUser = useSelector(selectCurrentUser);

  const isCurrentUser = userId === currentUser?.id;

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const [error, result]: [
        Error | undefined,
        (
          | { items: GetRecipeShort[]; page: number; totalPages: number }
          | undefined
        ),
      ] = await tryCatch(
        get(
          `/api/users/favorites?page=${favoritePagination.page}&limit=${favoritePagination.limit}`,
        ),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result) {
        setFavoriteRecipeList(result.items);
        setFavoritePagination((prev) => ({
          ...prev,
          totalPages: result.totalPages,
        }));
      }
    };

    fetchFavoriteRecipes();
  }, [favoritePagination.page, favoritePagination.limit]);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      const [error, result]: [
        Error | undefined,
        (
          | { items: GetRecipeShort[]; page: number; totalPages: number }
          | undefined
        ),
      ] = await tryCatch(
        get(
          `/api/users/${userId}/recipes?page=${recipePagination.page}&limit=${recipePagination.limit}`,
        ),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result) {
        setUserRecipesList(result.items);
        setRecipePagination((prev) => ({
          ...prev,
          totalPages: result.totalPages,
        }));
      }

      if (error) {
        toast.error(error);
        return;
      }
    };

    fetchUserRecipes();
  }, [userId, recipePagination.limit, recipePagination.page]);

  useEffect(() => {
    if (userId === currentUser?.id) {
      return;
    }

    const fetchUserDetails = async (userId: string) => {
      const [error, data] = await tryCatch(
        get<OtherUserDetails>(`/api/users/${userId}/details`, {
          schema: OtherUserDetailsSchema,
        }),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setUser(data);
    };

    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId, currentUser]);

  useEffect(() => {
    const pageFromParams = Number(searchParams.get('page') || '1');

    setFavoritePagination((prev) => ({
      ...prev,
      page: pageFromParams,
    }));

    setRecipePagination((prev) => ({
      ...prev,
      page: pageFromParams,
    }));

    if (containerRef.current) {
      scrollToElement(containerRef.current);
    }
  }, [searchParams]);

  const logoutHandler = async () => {
    dispatch(setCurrentUser(null));

    await tryCatch(post('/api/users/logout', null));

    navigate('/', { viewTransition: true });
  };

  const handleOpenRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}`, { viewTransition: true });
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    const [error] = await tryCatch(del(`/api/recipes/${recipeId}`));
    if (error) {
      toast.error(error.message);
      return;
    }
    setUserRecipesList((prev) =>
      prev.filter((recipe) => recipe.id !== recipeId),
    );
  };

  const handleRemoveRecipeFromFavorite = async (recipeId: string) => {
    const [error] = await tryCatch(del(`/api/recipes/${recipeId}/favorite`));
    if (error) {
      toast.error(error.message);
      return;
    }
    setFavoriteRecipeList((prev) =>
      prev.filter((recipe) => recipe.id !== recipeId),
    );
  };

  return (
    <Container>
      <div ref={containerRef} className={styles.userProfile}>
        <div className={styles.userProfileHeaderWrapper}>
          <div className={styles.navigate}>
            <NavLink to="/">Home /</NavLink>
            <p className={styles.navigateStaticText}> Profile</p>
          </div>
          <h1 className={styles.title}>Profile</h1>
          <p>
            Reveal your culinary art, share your favorite recipe and create
            gastronomic masterpieces with us.
          </p>
        </div>
        <div className={styles.userProfileBlock}>
          <div className={styles.userCardBlock}>
            <div className={styles.userCardRemoveAfterImplementingComponent}>
              <p>Replace this div with component</p>
            </div>
            <Button
              type="button"
              kind="primary"
              size="medium"
              clickHandler={logoutHandler}
            >
              Log Out
            </Button>
          </div>

          <div className={styles.userTabsSection}>
            <Tabs className={styles.tabs}>
              <TabList className={styles.tabList}>
                {isCurrentUser ? (
                  <>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      My Recipes
                    </Tab>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      My Favorites
                    </Tab>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      Followers
                    </Tab>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      Following
                    </Tab>
                  </>
                ) : (
                  <>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      Recipes
                    </Tab>
                    <Tab
                      className={styles.tabTitle}
                      selectedClassName={styles.activeTabTitle}
                    >
                      Followers
                    </Tab>
                  </>
                )}
              </TabList>
              {isCurrentUser ? (
                <>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <RecipeTab
                      recipeList={userRecipesList}
                      handleOpenRecipe={handleOpenRecipe}
                      handleRemoveRecipe={handleRemoveRecipe}
                      isCurrentUser={isCurrentUser}
                      pagination={recipePagination}
                    />
                  </TabPanel>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <RecipeTab
                      recipeList={favoriteRecipeList}
                      handleOpenRecipe={handleOpenRecipe}
                      handleRemoveRecipe={handleRemoveRecipeFromFavorite}
                      isCurrentUser={isCurrentUser}
                      pagination={favoritePagination}
                    />
                  </TabPanel>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <div>Replace with "Followers" component</div>
                  </TabPanel>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <div>Replace with "Followers" component</div>
                  </TabPanel>
                </>
              ) : (
                <>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <RecipeTab
                      recipeList={userRecipesList}
                      handleOpenRecipe={handleOpenRecipe}
                      handleRemoveRecipe={handleRemoveRecipe}
                      isCurrentUser={isCurrentUser}
                      pagination={recipePagination}
                    />
                  </TabPanel>
                  <TabPanel
                    className={styles.tabPanel}
                    selectedClassName={styles.activeTabPanel}
                  >
                    <div>Replace with "Followers" component</div>
                  </TabPanel>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserPage;
