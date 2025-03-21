import BurgerMenu from '../../../ui/BurgerMenu/BurgerMenu';

const UserBar = () => {
  return <div>UserBar {window.innerWidth < 768 ? <BurgerMenu /> : null}</div>;
};

export default UserBar;
