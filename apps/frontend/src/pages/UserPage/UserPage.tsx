import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import {
  type OtherUserDetails,
  OtherUserDetailsSchema,
} from '@goit-fullstack-final-project/schemas';

import Container from '../../components/layout/Container/Container';
import Button from '../../components/ui/Button/Button';
import { tryCatch } from '../../helpers/catchError';
import { get, post } from '../../helpers/http';
import { selectCurrentUser } from '../../redux/users/selectors';
import { setCurrentUser } from '../../redux/users/slice';

import styles from './UserPage.module.css';

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: userId } = useParams<{ id: string }>();

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [user, setUser] = useState<OtherUserDetails | null>(null);

  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (userId === currentUser?.id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
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
    }
  }, [userId, currentUser]);

  const logoutHandler = async () => {
    dispatch(setCurrentUser(null));
    await tryCatch(post('/api/users/logout', {}));
    navigate('/');
  };

  return (
    <Container>
      <div className={styles.userProfile}>
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
                  <TabPanel>
                    <div>Replace with "Recipes" component</div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      Replace with "Recipes" component, but pass favorites list
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>Replace with "Followers" component</div>
                  </TabPanel>
                  <TabPanel>
                    <div>Replace with "Followers" component</div>
                  </TabPanel>
                </>
              ) : (
                <>
                  <TabPanel>
                    <div>Replace with "Recipes" component</div>
                  </TabPanel>
                  <TabPanel>
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
