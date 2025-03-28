import { type FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

interface FiltersProps {
  onChangeIngredient: (ingredientId: string | undefined) => void;
  onChangeArea: (areaId: string | undefined) => void;
}

export const RecipeFilters: FC<FiltersProps> = ({
  onChangeIngredient,
  onChangeArea,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const [selectedIngredient, setSelectedIngredient] =
    useState<OptionType | null>(null);
  const [selectedArea, setSelectedArea] = useState<OptionType | null>(null);

  useEffect(() => {
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
    if (areas.length === 0) {
      dispatch(fetchAreas());
    }
  }, [dispatch, ingredients, areas]);

  const ingredientsOptions: OptionType[] = mapToOptions(
    ingredients,
    'Ingredients',
  );
  const areasOptions: OptionType[] = mapToOptions(areas, 'Areas');

  const classNames = {
    placeholder: () => clsx(['selectPlaceholder']),
    dropdownIndicator: () => 'selectDropdownIndicator',
    indicatorSeparator: () => clsx(['selectIndicatorSeparator']),
    control: () => clsx(['select']),
    menu: () => 'selectMenu',
    option: ({ isSelected }: { isSelected: boolean }) =>
      clsx(['selectOption', isSelected && 'selectOptionSelected']),
  };

  return (
    <div className={clsx(styles.filtersWrapper)}>
      <Select
        classNames={classNames}
        classNamePrefix="select"
        options={ingredientsOptions}
        value={selectedIngredient}
        placeholder="Ingredients"
        onChange={(option) => {
          onChangeIngredient(option?.value === '' ? undefined : option?.value);
          setSelectedIngredient(option);
        }}
      />
      <Select
        classNames={classNames}
        classNamePrefix="select"
        options={areasOptions}
        value={selectedArea}
        placeholder="Area"
        onChange={(option) => {
          onChangeArea(option?.value === '' ? undefined : option?.value);
          setSelectedArea(option);
        }}
      />
    </div>
  );
};

export default RecipeFilters;
