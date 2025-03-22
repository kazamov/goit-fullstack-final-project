import { useState } from 'react';

import LogOutModal from '../LogOutModal/LogOutModal';

const UserBar = () => {
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const onConfirm = () => {
    console.log('logout');
  };

  return (
    <div>
      UserBar
      <button type="button" onClick={() => setIsLogOutOpen(true)}>
        Log out
      </button>
      <LogOutModal
        isOpen={isLogOutOpen}
        onConfirm={onConfirm}
        onClose={() => setIsLogOutOpen(false)}
      />
    </div>
  );
};

export default UserBar;
