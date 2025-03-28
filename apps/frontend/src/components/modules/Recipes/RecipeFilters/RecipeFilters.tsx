import { type FC, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import type { SingleValue } from 'react-select';
import Select from 'react-select';
import clsx from 'clsx';

import { selectAreas } from '../../../../redux/areas/selectors';
import { fetchAreas } from '../../../../redux/areas/slice';
import { selectIngredients } from '../../../../redux/ingredients/selectors';
import { fetchIngredients } from '../../../../redux/ingredients/slice';
import type { AppDispatch } from '../../../../redux/store';

import styles from './RecipeFilters.module.css';

type OptionType = { value: string | undefined; label: string };

const mapToOptions = (
  items: { id: string | undefined; name: string }[],
  suffix: string,
): OptionType[] => {
  const selectItems = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  return [{ value: '', label: `All ${suffix}` }, ...selectItems];
};

export const RecipeFilters: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const [searchParams, setSearchParams] = useSearchParams();

  const ingredientId = searchParams.get('ingredientId');
  const areaId = searchParams.get('areaId');

  const ingredientsOptions: OptionType[] = mapToOptions(
    ingredients,
    'Ingredients',
  );
  const selectedIngredient = useMemo(
    () => ingredientsOptions.find((ing) => ing.value === ingredientId) ?? null,
    [ingredientId, ingredientsOptions],
  );

  const areasOptions: OptionType[] = mapToOptions(areas, 'Areas');
  const selectedArea = useMemo(
    () => areasOptions.find((area) => area.value === areaId) ?? null,
    [areaId, areasOptions],
  );

  const handleIngredientChange = useCallback(
    (option: SingleValue<OptionType>) => {
      setSearchParams((prevParams) => {
        const value = option?.value ?? '';
        if (value === '') {
          prevParams.delete('ingredientId');
        } else {
          prevParams.set('ingredientId', value);
        }

        prevParams.set('page', '1');

        return prevParams;
      });
    },
    [setSearchParams],
  );

  const handleAreaChange = useCallback(
    (option: SingleValue<OptionType>) => {
      setSearchParams((prevParams) => {
        const value = option?.value ?? '';
        if (value === '') {
          prevParams.delete('areaId');
        } else {
          prevParams.set('areaId', value);
        }

        prevParams.set('page', '1');

        return prevParams;
      });
    },
    [setSearchParams],
  );

  const classNames = {
    placeholder: () => clsx(['selectPlaceholder']),
    dropdownIndicator: () => 'selectDropdownIndicator',
    indicatorSeparator: () => clsx(['selectIndicatorSeparator']),
    control: () => clsx(['select']),
    menu: () => 'selectMenu',
    option: ({ isSelected }: { isSelected: boolean }) =>
      clsx(['selectOption', isSelected && 'selectOptionSelected']),
  };

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
    if (areas.length === 0) {
      dispatch(fetchAreas());
    }
  }, [dispatch, ingredients, areas]);

  return (
    <div className={clsx(styles.filtersWrapper)}>
      <Select
        classNames={classNames}
        classNamePrefix="select"
        options={ingredientsOptions}
        value={selectedIngredient}
        placeholder="Ingredients"
        onChange={handleIngredientChange}
      />
      <Select
        classNames={classNames}
        classNamePrefix="select"
        options={areasOptions}
        value={selectedArea}
        placeholder="Area"
        onChange={handleAreaChange}
      />
    </div>
  );
};

export default RecipeFilters;
