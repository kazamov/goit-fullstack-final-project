import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import clsx from 'clsx';

import type { CurrentUserDetails } from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import { UserCard } from '../../components/modules/UserCard/UserCard';
import Button from '../../components/ui/Button/Button';
import Loader from '../../components/ui/Loader/Loader';
import MainTitle from '../../components/ui/MainTitle/MainTitle';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import SubTitle from '../../components/ui/SubTitle/SubTitle';
import { tryCatch } from '../../helpers/catchError';
import { patchFormData } from '../../helpers/http';
import { scrollToElement } from '../../helpers/scrollToTop';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { AppDispatch } from '../../redux/store';
import { setModalOpened } from '../../redux/ui/slice';
import {
  selectCurrentUserId,
  selectProfileDetails,
} from '../../redux/users/selectors';
import { fetchProfileDetails, updateAvatar } from '../../redux/users/slice';

import styles from './ProfilePage.module.css';

function getTabUrlMapping(): Record<number, string> {
  return {
    0: `/profile/recipes`,
    1: `/profile/favorites`,
    2: `/profile/followers`,
    3: `/profile/following`,
  };
}

function ProfilePage() {
  const isDesktop = useMediaQuery('(min-width: 1440px)');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUserId = useSelector(selectCurrentUserId) as string;
  const profileDetails = useSelector(
    selectProfileDetails,
  ) as CurrentUserDetails | null;
  const [isAvatarUploading, setIsAvatarUploading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const page = searchParams.get('page');
  const perPage = searchParams.get('perPage');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const tabUrlMapping = useMemo(() => {
    return getTabUrlMapping();
  }, []);

  const handleLogout = useCallback(async () => {
    dispatch(setModalOpened({ modal: 'logout', opened: true }));
  }, [dispatch]);

  const handleUpdateAvatar = useCallback(
    async (file: File) => {
      setIsAvatarUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const [error, avatar] = await tryCatch(
        patchFormData<{ avatarURL: string }>('/api/users/avatars', formData),
      );

      setIsAvatarUploading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      dispatch(updateAvatar({ avatarUrl: avatar.avatarURL }));
    },
    [dispatch],
  );

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
    if (location.pathname === '/profile') {
      navigate(`/profile/recipes`, { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    dispatch(fetchProfileDetails(currentUserId));
  }, [currentUserId, dispatch]);

  useEffect(() => {
    if (containerRef.current && isDesktop) {
      scrollToElement(containerRef.current);
      return;
    }
    if (tabsContainerRef.current && !isDesktop) {
      scrollToElement(tabsContainerRef.current);
      return;
    }
  }, [isDesktop, page, perPage]);

  if (!profileDetails) {
    return <Loader className="positionAbsoluteCenter" />;
  }

  return (
    <section id="currentUserProfile" className={clsx(styles.section)}>
      <Container>
        <div ref={containerRef} className={styles.userProfile}>
          <div className={styles.userProfileHeaderWrapper}>
            <PathInfo
              pages={[
                { name: 'Home', path: '/' },
                { name: 'Profile', path: `/profile` },
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
                followingCount={profileDetails.followingCount}
                onAvatarChange={handleUpdateAvatar}
                isCurrentUser
                isLoading={isAvatarUploading}
              />
              <Button
                type="button"
                kind="primary"
                size="medium"
                clickHandler={handleLogout}
              >
                Log Out
              </Button>
            </div>

            <div ref={tabsContainerRef} className={styles.userTabsSection}>
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
}

export default ProfilePage;
