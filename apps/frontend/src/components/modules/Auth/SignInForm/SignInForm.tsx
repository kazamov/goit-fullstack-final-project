import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import type { LoginUserResponse } from '@goit-fullstack-final-project/schemas';
import {
  LoginUserPayloadSchema,
  LoginUserResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../../../helpers/catchError';
import { delay } from '../../../../helpers/delay';
import { post } from '../../../../helpers/http';
import { setModalOpened } from '../../../../redux/ui/slice';
import { setCurrentUser } from '../../../../redux/users/slice';
import Button from '../../../ui/Button/Button';

import styles from './SignInForm.module.css';

type FormData = {
  password: string;
  email: string;
};

const SignInForm = () => {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(LoginUserPayloadSchema),
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      await delay(300);

      const [error, user] = await tryCatch(
        post<LoginUserResponse>('/api/users/login', data, {
          schema: LoginUserResponseSchema,
        }),
      );

      if (error) {
        toast.error(error.message);
        setFocus('email', { shouldSelect: true });
        return;
      }

      dispatch(setCurrentUser(user));
      dispatch(setModalOpened({ modal: 'login', opened: false }));
      reset();
    },
    [dispatch, reset, setFocus],
  );

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
    <form onSubmit={handleSubmit(onSubmit)} className={styles.signInForm}>
      <div className={styles.inputsContainer}>
        <div
          className={buildInputClass({
            isInvalid: !!errors.email,
            value: emailValue,
          })}
        >
          <input
            className="input"
            placeholder="Email*"
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
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
