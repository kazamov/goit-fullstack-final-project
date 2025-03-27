import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { z } from 'zod';

import type { GetIngredientResponse } from '@goit-fullstack-final-project/schemas';
import {
  CreateRecipePayloadSchema,
  RecipeIngredientSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../helpers/catchError';
import { post } from '../../../helpers/http';
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
  ingredients: z.array(RecipeIngredientSchema),
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

const AddRecipeForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const areas = useSelector(selectAreas);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchIngredients());
    dispatch(fetchAreas());
  }, [dispatch]);

  const [displayedIngredients, setDisplayedIngredients] =
    useState<GetIngredientResponse>([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [measure, setMeasure] = useState('');
  const [resetImage, setResetImage] = useState(false);

  const selectFile = (file: File) => {
    setValue('thumb', file);
    setResetImage(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
      time: 1,
      thumb: undefined,
    },
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(async (data: FormData) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (!(value instanceof File)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const [error, recipe] = await tryCatch(
      post('/api/recipes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );

    if (error) {
      toast.error(error.message);
      return;
    }
  }, []);

  const resetForm = () => {
    reset();
    setResetImage(true);
    setMeasure('');
    setSelectedIngredient('');
    setDisplayedIngredients([]);
  };

  // VALUES
  const titleValue = watch('title');
  const descriptionValue = watch('description');
  const instructionsValue = watch('instructions');
  const ingredientsValue = watch('ingredients');
  const timeValue = watch('time');

  // TO DO: remove
  const formValues = watch();

  const increaseTime = () => setValue('time', timeValue + 1);
  const decreaseTime = () => setValue('time', Math.max(1, timeValue - 1));

  // Handle adding/removing an ingredient
  const handleAddIngredient = () => {
    if (!measure) return;
    const ingredient = ingredients.find((ing) => ing.id === selectedIngredient);
    if (ingredient) {
      append({ id: ingredient.id, measure });
      toggleIngredient(ingredient.id);
      setMeasure('');
      setSelectedIngredient('');
    }
  };

  const handleRemoveIngredient = (id: string) => {
    console.log(ingredientsValue);

    const index = ingredientsValue.findIndex(
      (ingredient) => ingredient.id === id,
    );
    if (index !== -1) {
      remove(index);
    }
    toggleIngredient(id, false);
  };

  //Toggle ingredient in the selected list
  const toggleIngredient = (ingredientId: string, toAdd = true) => {
    if (toAdd) {
      const ingredient = ingredients.find((item) => item.id === ingredientId);
      setDisplayedIngredients(
        ingredient
          ? [...displayedIngredients, ingredient]
          : displayedIngredients,
      );

      return;
    }
    const exists = displayedIngredients.some(
      (item) => item.id === ingredientId,
    );

    if (exists) {
      setDisplayedIngredients(
        displayedIngredients.filter((item) => item.id !== ingredientId),
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
      <pre>{JSON.stringify(formValues, null, 2)}</pre>
      {/* <pre>{JSON.stringify(errors)}</pre> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={clsx(styles.content)}>
          <div className={clsx(styles.column)}>
            <div className={clsx(styles.file)}>
              <UploadRecipePhoto
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
                <select {...register('categoryId')}>
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
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
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select an option
                  </option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </select>

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

              {!!errors.ingredients && (
                <span className="textAreaError">
                  {errors.ingredients.message}
                </span>
              )}

              {displayedIngredients.length ? (
                <RecipeIngredients
                  onDelete={handleRemoveIngredient}
                  ingredients={displayedIngredients}
                />
              ) : null}
            </div>

            <div className={clsx(styles.formRow)}>
              <label className={clsx('inputLabel')}>Area</label>
              <select {...register('areaId')}>
                <option value="" disabled selected>
                  Select an option
                </option>
                {areas.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                maxLength={200}
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
                <span>/200</span>
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
              <Button kind="primary" type="submit">
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
