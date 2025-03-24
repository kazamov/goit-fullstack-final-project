import type { SelectedCategory } from '../../../redux/categories/slice';
import Container from '../../layout/Container/Container';
import MainTitle from '../../ui/MainTitle/MainTitle';
import SubTitle from '../../ui/SubTitle/SubTitle';

interface CategoriesProps {
  category: SelectedCategory;
}

const Recipes = ({ category }: CategoriesProps) => {
  return (
    <section id="recipes">
      <Container>
        <MainTitle title={category.name} />
        <SubTitle title={category.description} />
      </Container>
    </section>
  );
};

export default Recipes;
