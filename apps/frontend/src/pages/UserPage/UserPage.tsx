import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import clsx from 'clsx';

import type { OtherUserDetails } from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import { UserCard } from '../../components/modules/UserCard/UserCard';
import Button from '../../components/ui/Button/Button';
import MainTitle from '../../components/ui/MainTitle/MainTitle';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import SubTitle from '../../components/ui/SubTitle/SubTitle';
import { tryCatch } from '../../helpers/catchError';
import { del, post } from '../../helpers/http';
import type { AppDispatch } from '../../redux/store';
import { selectProfileDetails } from '../../redux/users/selectors';
import { fetchProfileDetails } from '../../redux/users/slice';

import styles from './UserPage.module.css';

function getTabUrlMapping(userId: string): Record<number, string> {
  return {
    0: `/user/${userId}/recipes`,
    1: `/user/${userId}/followers`,
  };
}

const UserPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId } = useParams<{ id: string }>();

  const profileDetails = useSelector(
    selectProfileDetails,
  ) as OtherUserDetails | null;

  const [followingLoading, setFollowingLoading] = useState<boolean>(false);

  const tabUrlMapping = useMemo(() => {
    return getTabUrlMapping(userId as string);
  }, [userId]);

  const handleFollow = useCallback(async () => {
    if (!profileDetails) {
      return;
    }

    setFollowingLoading(true);

    const [error] = await tryCatch(
      profileDetails.following
        ? del(`/api/users/${userId}/follow`)
        : post(`/api/users/${userId}/follow`, null),
    );

    setFollowingLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
  }, [profileDetails, userId]);

  const handleTabSelect = useCallback(
    (index: number) => {
      const currentTabUrl = tabUrlMapping[index];

      navigate(currentTabUrl, {
        viewTransition: true,
      });
    },
    [navigate, tabUrlMapping],
  );

  const selectedTabIndex = useMemo(() => {
    const pathname = location.pathname;

    const [index] = Array.from(Object.entries(tabUrlMapping)).find(
      ([_, url]) => {
        return url === pathname;
      },
    ) ?? [0, ''];
    return Number(index);
  }, [location.pathname, tabUrlMapping]);

  useEffect(() => {
    if (location.pathname === `/user/${userId}`) {
      navigate(`/user/${userId}/recipes`, { replace: true });
    }
  }, [location.pathname, navigate, userId]);

  useEffect(() => {
    dispatch(fetchProfileDetails(userId as string));
  }, [dispatch, userId]);

  if (!profileDetails) {
    return null;
  }

  return (
    <section id="userProfile" className={clsx(styles.section)}>
      <Container>
        <div className={styles.userProfile}>
          <div className={styles.userProfileHeaderWrapper}>
            <PathInfo
              pages={[
                { name: 'Home', path: '/' },
                { name: 'Profile', path: `/user/${userId}` },
              ]}
            />
            <div className={clsx(styles.wrapper)}>
              <MainTitle title="Profile" />
              <SubTitle title="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us." />
            </div>
          </div>
          <div className={styles.userProfileBlock}>
            <div className={styles.userCardBlock}>
              <UserCard
                avatar={profileDetails.avatarUrl}
                name={profileDetails.name}
                email={profileDetails.email}
                recipesCount={profileDetails.recipesCount}
                favoritesCount={profileDetails.favoriteRecipesCount}
                followersCount={profileDetails.followersCount}
                followingCount={0}
                isCurrentUser={false}
              />
              <Button
                type="button"
                kind="primary"
                size="medium"
                clickHandler={handleFollow}
                disabled={followingLoading}
                busy={followingLoading}
              >
                {profileDetails.following ? 'Following' : 'Follow'}
              </Button>
            </div>

            <div className={styles.userTabsSection}>
              <Tabs
                selectedIndex={selectedTabIndex}
                onSelect={handleTabSelect}
                className={styles.tabs}
              >
                <TabList className={styles.tabList}>
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
                </TabList>
                <TabPanel
                  className={styles.tabPanel}
                  selectedClassName={styles.activeTabPanel}
                >
                  <Outlet />
                </TabPanel>
                <TabPanel
                  className={styles.tabPanel}
                  selectedClassName={styles.activeTabPanel}
                >
                  <Outlet />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UserPage;
