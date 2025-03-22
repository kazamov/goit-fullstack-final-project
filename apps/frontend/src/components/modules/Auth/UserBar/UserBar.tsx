import { useState } from 'react';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
  
import BurgerMenu from '../../../ui/BurgerMenu/BurgerMenu';  
import LogOutModal from '../LogOutModal/LogOutModal';

import styles from './UserBar.module.css';
  
const UserBar = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const onConfirm = () => {
    console.log('logout');
  };

  return (
    <div className={styles.userBar}>
      UserBar
      <button type="button" onClick={() => setIsLogOutOpen(true)}>
        Log out
      </button>
      <LogOutModal
        isOpen={isLogOutOpen}
        onConfirm={onConfirm}
        onClose={() => setIsLogOutOpen(false)}
      />
      {isMobile && <BurgerMenu />}
    </div>
  );
};

export default UserBar;
