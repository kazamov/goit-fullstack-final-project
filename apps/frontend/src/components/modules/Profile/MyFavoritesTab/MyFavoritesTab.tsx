import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type {
  GetPaginatedRecipeShort,
  GetRecipeShort,
} from '@goit-fullstack-final-project/schemas';
import { GetPaginatedRecipeShortSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { del, get } from '../../../../helpers/http';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import ButtonWithIcon from '../../../ui/ButtonWithIcon/ButtonWithIcon';
import { RecipesTabContent } from '../RecipesTabContent/RecipesTabContent';
import { usePagingParams } from '../usePagingParams';

const DEFAULT_PAGE = '1';
const DEFAULT_PER_PAGE = '9';

function MyFavoritesTab() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const { page, perPage } = usePagingParams(DEFAULT_PAGE, DEFAULT_PER_PAGE);
  const [recipesList, setRecipesList] = useState<GetRecipeShort[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const handleRemoveRecipeFromFavorite = useCallback(
    async (recipeId: string) => {
      const [error] = await tryCatch(del(`/api/recipes/${recipeId}/favorite`));

      if (error) {
        toast.error(error.message);
        return;
      }
    },
    [],
  );

  const actionButtons = useCallback(
    (recipeId: string) => {
      return (
        <ButtonWithIcon
          kind="secondary"
          type="submit"
          iconType="icon-trash"
          size={isMobile ? 'small' : 'medium'}
          aria-label="Remove from favorites"
          clickHandler={() => handleRemoveRecipeFromFavorite(recipeId)}
        />
      );
    },
    [handleRemoveRecipeFromFavorite, isMobile],
  );

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      const [error, data] = await tryCatch(
        get<GetPaginatedRecipeShort>(
          `/api/users/favorites?page=${page}&perPage=${perPage}`,
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

    fetchFavoriteRecipes();
  }, [page, perPage]);

  return (
    <RecipesTabContent
      actionButtons={actionButtons}
      recipes={recipesList}
      totalPages={totalPages}
    />
  );
}

export default MyFavoritesTab;
