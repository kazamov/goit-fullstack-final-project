import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { del, get } from '../../../../helpers/http';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { usePagingParams } from '../../../../hooks/usePagingParams';
import type { AppDispatch } from '../../../../redux/store';
import { selectCurrentUserId } from '../../../../redux/users/selectors';
import { fetchProfileDetails } from '../../../../redux/users/slice';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyRecipesTab() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector(selectCurrentUserId) as string;
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const currentUserId = useSelector(selectCurrentUserId) as string;

  const fetchUserRecipes = useCallback(async () => {
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
  }, [id, page, perPage]);

  const handleRemoveRecipe = useCallback(
    async (recipeId: string) => {
      const [error] = await tryCatch(del(`/api/recipes/${recipeId}`));

      if (error) {
        toast.error(error.message);
        return;
      }

      dispatch(fetchProfileDetails(currentUserId));
      await fetchUserRecipes();
    },
    [currentUserId, dispatch, fetchUserRecipes],
  );

  const actionButtons = useCallback(
    (recipeId: string) => {
      return (
        <ButtonWithIcon
          kind="secondary"
          type="submit"
          iconType="icon-trash"
          size={isMobile ? 'small' : 'medium'}
          aria-label="Remove my recipe"
          clickHandler={() => handleRemoveRecipe(recipeId)}
        />
      );
    },
    [handleRemoveRecipe, isMobile],
  );

  const emptyContentTemplate = useCallback((className: string) => {
    return (
      <p className={className}>
        Nothing has been added to your recipes list yet. Please browse our
        recipes and add your favorites for easy access in the future.
      </p>
    );
  }, []);

  useEffect(() => {
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  return (
    <RecipesTabContent
      recipes={recipesList}
      emptyContentTemplate={emptyContentTemplate}
      actionButtons={actionButtons}
      totalPages={totalPages}
    />
  );
}

export default MyRecipesTab;
