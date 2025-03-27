import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import type { CreateUserResponse } from '@goit-fullstack-final-project/schemas';
import {
  CreateUserPayloadSchema,
  CreateUserResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { post } from '../../../../helpers/http';
import type { AppDispatch } from '../../../../redux/store';
import { setModalOpened } from '../../../../redux/ui/slice';
import { setCurrentUser } from '../../../../redux/users/slice';
import Button from '../../../ui/Button/Button';

import styles from './SignUpForm.module.css';

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(CreateUserPayloadSchema),
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      const [error, user] = await tryCatch(
        post<CreateUserResponse>('/api/users/register', JSON.stringify(data), {
          schema: CreateUserResponseSchema,
        }),
      );

      if (error) {
        toast.error(error.message);
        setFocus('email', { shouldSelect: true });
        return;
      }

      dispatch(setCurrentUser(user));
      dispatch(setModalOpened({ modal: 'register', opened: false }));
      reset();
    },
    [dispatch, reset, setFocus],
  );

  const nameValue = watch('name');
  const emailValue = watch('email');
  const passwordValue = watch('password');

  const buildInputClass = ({
    isInvalid,
    value,
  }: {
    isInvalid: boolean;
    value: string;
  }) => {
    return clsx(
      'inputWrapper',
      isInvalid && 'inputWrapperInvalid',
      value?.trim() && 'inputWrapperFilled',
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.signUpForm}>
      <div className={styles.inputsContainer}>
        <div
          className={buildInputClass({
            isInvalid: !!errors.name,
            value: nameValue,
          })}
        >
          <input
            className="input"
            type="text"
            placeholder="Name*"
            autoComplete="off"
            {...register('name')}
          />
          {!!errors.name && (
            <span className="inputError">{errors.name.message}</span>
          )}
        </div>
        <div
          className={buildInputClass({
            isInvalid: !!errors.email,
            value: emailValue,
          })}
        >
          <input
            className="input"
            placeholder="Email*"
            autoComplete="off"
            {...register('email')}
          />
          {!!errors.email && (
            <span className="inputError">{errors.email.message}</span>
          )}
        </div>
        <div
          className={buildInputClass({
            isInvalid: !!errors.password,
            value: passwordValue,
          })}
        >
          <input
            className="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password*"
            autoComplete="off"
            {...register('password')}
          />
          {passwordValue?.trim() && (
            <button
              className="inputButtonIcon"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              <svg className={styles.togglePasswordVisibility}>
                {showPassword ? (
                  <use href="/images/icons.svg#icon-eye" />
                ) : (
                  <use href="/images/icons.svg#icon-eye-off" />
                )}
              </svg>
            </button>
          )}
          {!!errors.password && (
            <span className="inputError">{errors.password.message}</span>
          )}
        </div>
      </div>
      <Button
        kind="primary"
        type="submit"
        disabled={isSubmitting}
        busy={isSubmitting}
      >
        Create
      </Button>
    </form>
  );
};

export default SignUpForm;
