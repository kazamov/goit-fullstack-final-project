import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
  UserShortDetails,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { del, get } from '../../../../helpers/http';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { selectCurrentUser } from '../../../../redux/users/selectors';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';
import { usePagingParams } from '../usePagingParams';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyRecipesTab() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { id } = useSelector(selectCurrentUser) as UserShortDetails;
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleRemoveRecipe = useCallback(async (recipeId: string) => {
    const [error] = await tryCatch(del(`/api/recipes/${recipeId}`));

    if (error) {
      toast.error(error.message);
      return;
    }
    /* setUserRecipesList((prev) =>
          prev.filter((recipe) => recipe.id !== recipeId),
        ); */
  }, []);

  const actionButtons = useCallback(
    (recipeId: string) => {
      return (
        <ButtonWithIcon
          kind="secondary"
          type="submit"
          iconType="icon-trash"
          size={isMobile ? 'small' : 'medium'}
          aria-label="Remove from favorites"
          clickHandler={() => handleRemoveRecipe(recipeId)}
        />
      );
    },
    [handleRemoveRecipe, isMobile],
  );

  useEffect(() => {
    const fetchUserRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/${id}/recipes?page=${page}&perPage=${perPage}`,
          { schema: GetPaginatedRecipeShortSchema },
        ),
      );

      if (error) {
        toast.error(error.message);
        setRecipesList([]);
        return;
      }

      setRecipesList(data.items);
      setTotalPages(data.totalPages);
    };

    fetchUserRecipes();
  }, [id, page, perPage]);

  return (
    <RecipesTabContent
      recipes={recipesList}
      actionButtons={actionButtons}
      totalPages={totalPages}
    />
  );
}

export default MyRecipesTab;
