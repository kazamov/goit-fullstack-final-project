import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { SingleValue } from 'react-select';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { z } from 'zod';

import type {
  GetRecipeResponse,
  IngredientCardObject,
} from '@goit-fullstack-final-project/schemas';
import {
  CreateRecipePayloadSchema,
  RecipeIngredientSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../helpers/catchError';
import { postFormData } from '../../../helpers/http';
import { selectAreas } from '../../../redux/areas/selectors';
import { fetchAreas } from '../../../redux/areas/slice';
import { selectCategories } from '../../../redux/categories/selectors';
import { fetchCategories } from '../../../redux/categories/slice';
import { selectIngredients } from '../../../redux/ingredients/selectors';
import { fetchIngredients } from '../../../redux/ingredients/slice';
import type { AppDispatch } from '../../../redux/store';
import Button from '../../ui/Button/Button';
import ButtonWithIcon from '../../ui/ButtonWithIcon/ButtonWithIcon';
import UploadRecipePhoto from '../../ui/UploadRecipePhoto/UploadRecipePhoto';
import RecipeIngredients from '../RecipeInfo/RecipeIngredients/RecipeIngredients';

import styles from './AddRecipeForm.module.css';

type OptionType = { value: string; label: string };

const mapToOptions = (items: { id: string; name: string }[]): OptionType[] =>
  items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

const ExtendedRecipePayloadSchema = CreateRecipePayloadSchema.omit({
  ingredients: true,
}).extend({
  thumb: z
    .union([z.instanceof(File), z.undefined()])
    .refine((file) => file !== null, {
      message: 'Image is required',
    })
    .refine((file) => file instanceof File && file.size > 0, {
      message: 'File is required and cannot be empty',
    }),
  ingredients: z
    .array(RecipeIngredientSchema)
    .min(1, 'At least one ingredient is required'),
});

export type FormData = z.infer<typeof ExtendedRecipePayloadSchema>;

const buildInputClass = ({
  isInvalid,
  value,
  prefix,
  classes,
}: {
  isInvalid: boolean;
  value: string;
  prefix: string;
  classes: string[];
}) => {
  return clsx(
    `${prefix}Wrapper`,
    isInvalid && `${prefix}WrapperInvalid`,
    value?.trim() && `${prefix}WrapperFilled`,
    ...classes,
  );
};

const COOKING_TIME_STEP = 5;
const COOKING_INITIAL_TIME = 1;

const AddRecipeForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  const areaOptions = mapToOptions(areas);
  const ingredientsOptions = mapToOptions(ingredients);
  const categoriesOptions = mapToOptions(categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (ingredients.length === 0) {
      dispatch(fetchIngredients());
    }
    if (areas.length === 0) {
      dispatch(fetchAreas());
    }
  }, [dispatch, categories, ingredients, areas]);

  const [displayedIngredients, setDisplayedIngredients] = useState<
    IngredientCardObject[]
  >([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientError, setIngredientError] = useState(false);
  const [measure, setMeasure] = useState('');
  const [measureError, setMeasureError] = useState(false);
  const [resetImage, setResetImage] = useState(false);

  const selectFile = (file: File) => {
    setValue('thumb', file);
    setResetImage(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(ExtendedRecipePayloadSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      ingredients: [],
      categoryId: '',
      areaId: '',
      time: COOKING_INITIAL_TIME,
      thumb: undefined,
    },
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (!(value instanceof File)) {
          formData.append(
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value),
          );
        } else {
          formData.append(key, value);
        }
      });

      const [error, recipe] = await tryCatch(
        postFormData<GetRecipeResponse>('/api/recipes', formData),
      );

      if (recipe) {
        navigate(`/recipes/${recipe.id}`, { viewTransition: true });
        return;
      }

      if (error) {
        toast.error(error.message);
        return;
      }
    },
    [navigate],
  );

  const resetForm = () => {
    reset();
    setResetImage(true);
    setMeasure('');
    setSelectedIngredient('');
    setDisplayedIngredients([]);
  };

  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const instructionsValue = watch('instructions');
  const ingredientsValue = watch('ingredients');
  const areasValue = watch('areaId');
  const categoriesValue = watch('categoryId');
  const timeValue = watch('time');

  const increaseTime = () =>
    setValue(
      'time',
      Math.round(timeValue / COOKING_TIME_STEP) * COOKING_TIME_STEP +
        COOKING_TIME_STEP,
    );
  const decreaseTime = () =>
    setValue('time', Math.max(1, timeValue - COOKING_TIME_STEP));

  const handleAddIngredient = () => {
    if (!selectedIngredient) {
      setIngredientError(true);
    } else {
      setIngredientError(false);
    }

    if (!measure) {
      setMeasureError(true);
    } else {
      setMeasureError(false);
    }

    if (!selectedIngredient || !measure) {
      return;
    }

    const ingredient = ingredients.find((ing) => ing.id === selectedIngredient);
    if (ingredient) {
      append({ id: ingredient.id, measure });
      toggleIngredient({ id: ingredient.id, measure });
      setMeasure('');
      setSelectedIngredient('');
    }
  };

  const handleRemoveIngredient = (id: string) => {
    const index = ingredientsValue.findIndex(
      (ingredient) => ingredient.id === id,
    );
    if (index !== -1) {
      toggleIngredient(ingredientsValue[index], false);
      remove(index);
    }
  };

  const toggleIngredient = (
    { id, measure }: { id: string; measure: string },
    toAdd = true,
  ) => {
    if (toAdd) {
      const ingredient = ingredients.find((item) => item.id === id);
      setDisplayedIngredients(
        ingredient
          ? [
              ...displayedIngredients,
              {
                id,
                measure: measure,
                imageUrl: ingredient.imageUrl,
                name: ingredient.name,
              },
            ]
          : displayedIngredients,
      );

      return;
    }
    const exists = displayedIngredients.some((item) => item.id === id);

    if (exists) {
      setDisplayedIngredients(
        displayedIngredients.filter((item) => item.id !== id),
      );
    }
  };

  const { append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const instructionsRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    if (ref && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight(descriptionRef);
  }, [descriptionValue]);
  useEffect(() => {
    adjustHeight(instructionsRef);
  }, [instructionsValue]);

  return (
    <section id="recipeForm" className={clsx(styles.recipeForm)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={clsx(styles.content)}>
          <div className={clsx(styles.column)}>
            <div className={clsx(styles.file)}>
              <UploadRecipePhoto
                className={errors.thumb ? 'invalidUpload' : ''}
                resetImage={resetImage}
                onFileSelect={selectFile}
              />

              {!!errors.thumb && (
                <span className="inputError">{errors.thumb.message}</span>
              )}
            </div>
          </div>
          <div className={clsx(styles.column)}>
            <div
              className={buildInputClass({
                isInvalid: !!errors.title,
                value: titleValue,
                prefix: 'inputTitle',
                classes: [styles.recipeTitle],
              })}
            >
              <input
                {...register('title')}
                className="input"
                type="text"
                placeholder="The name of the recipe"
              />

              {!!errors.title && (
                <span className="inputTitleError">{errors.title.message}</span>
              )}
            </div>
            <div
              className={buildInputClass({
                isInvalid: !!errors.description,
                value: descriptionValue,
                prefix: 'textArea',
                classes: [
                  styles.formRow,
                  'textAreaCounter',
                  styles.textAreaWrapper,
                ],
              })}
            >
              <textarea
                className="textArea"
                {...register('description')}
                ref={(e) => {
                  register('description').ref(e);
                  descriptionRef.current = e;
                }}
                maxLength={200}
                rows={1}
                placeholder="Enter a description of the dish"
              />
              <div className="textAreaCounter">
                <span
                  className={
                    descriptionValue?.length ? 'textAreaCounterCurrent' : ''
                  }
                >
                  {descriptionValue?.length}
                </span>
                <span>/200</span>
              </div>
              {!!errors.description && (
                <span className="textAreaError">
                  {errors.description.message}
                </span>
              )}
            </div>

            <div className={clsx(styles.formRow, styles.formRowCol)}>
              <div>
                <label className={clsx('inputLabel')}>Category</label>
                <div className={clsx('selectWrapper', styles.selectWrapper)}>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        placeholder="Select a category"
                        noOptionsMessage={() => 'Categories are loading...'}
                        {...field}
                        onChange={(selected: SingleValue<OptionType>) =>
                          field.onChange(selected?.value)
                        }
                        value={
                          categoriesOptions.find(
                            (opt) => opt.value === field.value,
                          ) ?? null
                        }
                        options={categoriesOptions}
                        classNames={{
                          placeholder: () =>
                            clsx([
                              'selectPlaceholder',
                              !!errors.categoryId && 'selectPlaceholderInvalid',
                            ]),
                          dropdownIndicator: () => 'selectDropdownIndicator',
                          indicatorSeparator: () =>
                            clsx(['selectIndicatorSeparator']),
                          control: () =>
                            clsx([
                              'select',
                              !!errors.categoryId && 'selectInvalid',
                              categoriesValue && 'selectFilled',
                            ]),
                          menu: () => 'selectMenu',
                          option: ({ isSelected }) =>
                            clsx([
                              'selectOption',
                              isSelected && 'selectOptionSelected',
                            ]),
                        }}
                      />
                    )}
                  />
                  {!!errors.categoryId && (
                    <span className="selectError">
                      {errors.categoryId.message}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className={clsx('inputLabel')}>Cooking Time</label>
                <div className={styles.cookingTime}>
                  <ButtonWithIcon
                    kind="secondary"
                    size="large"
                    type="button"
                    iconType="icon-minus"
                    clickHandler={decreaseTime}
                  />
                  <div className={clsx(styles.cookingTimeCount)}>
                    <span>{timeValue}</span>
                    <span>min</span>
                  </div>

                  <ButtonWithIcon
                    kind="secondary"
                    size="large"
                    type="button"
                    iconType="icon-plus"
                    clickHandler={increaseTime}
                  />
                </div>
              </div>
            </div>
            <div className={clsx(styles.formRow, styles.ingredients)}>
              <label className={clsx('inputLabel')}>Ingredients</label>
              <div className={styles.ingredientsInputs}>
                <div className={clsx('selectWrapper', styles.selectWrapper)}>
                  <Select
                    placeholder="Select an ingredient"
                    noOptionsMessage={() => 'Ingredients are loading...'}
                    onChange={(selected: SingleValue<OptionType>) =>
                      setSelectedIngredient(selected?.value ?? '')
                    }
                    value={
                      ingredientsOptions.find(
                        (opt) => opt.value === selectedIngredient,
                      ) ?? null
                    }
                    options={ingredientsOptions}
                    classNames={{
                      placeholder: () =>
                        clsx([
                          'selectPlaceholder',
                          !!errors.ingredients && 'selectPlaceholderInvalid',
                        ]),
                      dropdownIndicator: () => 'selectDropdownIndicator',
                      indicatorSeparator: () =>
                        clsx(['selectIndicatorSeparator']),
                      control: () =>
                        clsx([
                          'select',
                          selectedIngredient && 'selectFilled',
                          !!errors.ingredients && 'selectInvalid',
                        ]),
                      menu: () => 'selectMenu',
                      option: ({ isSelected }) =>
                        clsx([
                          'selectOption',
                          isSelected && 'selectOptionSelected',
                        ]),
                    }}
                  />
                  {!!errors.ingredients && (
                    <span className="selectError">
                      {errors.ingredients.message}
                    </span>
                  )}
                  {ingredientError && (
                    <span className="selectError">
                      Choose an ingredient, it is required
                    </span>
                  )}
                </div>
                <div
                  className={buildInputClass({
                    isInvalid: false,
                    value: measure,
                    prefix: 'textArea',
                    classes: [styles.textAreaWrapper],
                  })}
                >
                  <textarea
                    onChange={(e) => setMeasure(e.target.value)}
                    className="textArea"
                    maxLength={20}
                    rows={1}
                    value={measure}
                    placeholder="Enter quantity"
                  />
                  {measureError && (
                    <span
                      className={clsx('textAreaError', styles.measureError)}
                    >
                      Measure is required
                    </span>
                  )}
                </div>
              </div>

              <Button
                kind="secondary"
                type="button"
                clickHandler={handleAddIngredient}
              >
                <div className={styles.addButton}>
                  <span> Add ingredient</span>

                  <svg className={styles.icon}>
                    <use href="/images/icons.svg#icon-plus" />
                  </svg>
                </div>
              </Button>

              {displayedIngredients.length ? (
                <RecipeIngredients
                  onDelete={handleRemoveIngredient}
                  ingredients={displayedIngredients}
                />
              ) : null}
            </div>

            <div className={clsx(styles.formRow)}>
              <label className={clsx('inputLabel')}>Area</label>
              <div className={clsx('selectWrapper', styles.selectWrapper)}>
                <Controller
                  name="areaId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      placeholder="Select an area"
                      noOptionsMessage={() => 'Areas are loading...'}
                      {...field}
                      onChange={(selected: SingleValue<OptionType>) =>
                        field.onChange(selected?.value)
                      }
                      value={
                        areaOptions.find((opt) => opt.value === field.value) ??
                        null
                      }
                      options={areaOptions}
                      classNames={{
                        placeholder: () =>
                          clsx([
                            'selectPlaceholder',
                            !!errors.areaId && 'selectPlaceholderInvalid',
                          ]),
                        dropdownIndicator: () => 'selectDropdownIndicator',
                        indicatorSeparator: () =>
                          clsx(['selectIndicatorSeparator']),
                        control: () =>
                          clsx([
                            'select',
                            !!errors.areaId && 'selectInvalid',
                            areasValue && 'selectFilled',
                          ]),
                        menu: () => 'selectMenu',
                        option: ({ isSelected }) =>
                          clsx([
                            'selectOption',
                            isSelected && 'selectOptionSelected',
                          ]),
                      }}
                    />
                  )}
                />
                {!!errors.areaId && (
                  <span className="selectError">{errors.areaId.message}</span>
                )}
              </div>
            </div>

            <label className={clsx('inputLabel', styles.recipeTitle)}>
              Recipe Preparation
            </label>
            <div
              className={buildInputClass({
                isInvalid: !!errors.instructions,
                value: instructionsValue,
                prefix: 'textArea',
                classes: [
                  styles.formRow,
                  'textAreaCounter',
                  styles.textAreaWrapper,
                ],
              })}
            >
              <textarea
                {...register('instructions')}
                className="textArea"
                maxLength={1000}
                rows={1}
                placeholder="Enter recipe"
                ref={(e) => {
                  register('instructions').ref(e);
                  instructionsRef.current = e;
                }}
              />
              <div className="textAreaCounter">
                <span
                  className={
                    instructionsValue.length ? 'textAreaCounterCurrent' : ''
                  }
                >
                  {instructionsValue.length}
                </span>
                <span>/1000</span>
              </div>
              {!!errors.instructions && (
                <span className="textAreaError">
                  {errors.instructions.message}
                </span>
              )}
            </div>
            <div className={styles.button}>
              <ButtonWithIcon
                kind="secondary"
                size="large"
                type="button"
                iconType="icon-trash"
                clickHandler={resetForm}
              />
              <Button
                kind="primary"
                type="submit"
                busy={isSubmitting}
                disabled={isSubmitting}
              >
                Publish
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddRecipeForm;
