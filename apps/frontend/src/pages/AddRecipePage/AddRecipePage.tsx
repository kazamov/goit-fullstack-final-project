import clsx from 'clsx';

import Container from '../../components/layout/Container/Container';
import AddRecipeForm from '../../components/modules/AddRecipeForm/AddRecipeForm';
import MainTitle from '../../components/ui/MainTitle/MainTitle';
import PathInfo from '../../components/ui/PathInfo/PathInfo';
import SubTitle from '../../components/ui/SubTitle/SubTitle';

import styles from './AddRecipePage.module.css';

const AddRecipePage = () => {
  return (
    <section id="addRecipe" className={styles.section}>
      <Container>
        <PathInfo
          pages={[
            { name: 'Home', path: '/' },
            { name: 'Add Recipe', path: 'recipes/add' },
          ]}
        />
        <div className={clsx(styles.wrapper)}>
          <MainTitle title="Add recipe" />
          <SubTitle title="Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us." />
        </div>
        <AddRecipeForm />
      </Container>
    </section>
  );
};

export default AddRecipePage;
