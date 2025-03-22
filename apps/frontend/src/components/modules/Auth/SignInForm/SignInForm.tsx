import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { LoginUserPayloadSchema } from '@goit-fullstack-final-project/schemas';

import Button from '../../../ui/Button/Button';

import styles from './SignInForm.module.css';

type FormData = {
  password: string;
  email: string;
};

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(LoginUserPayloadSchema),
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

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
              {showPassword ? '+' : '-'}
            </button>
          )}
          {!!errors.password && (
            <span className="inputError">{errors.password.message}</span>
          )}
        </div>
      </div>
      <Button kind="primary" type="submit" disabled={!isValid}>
        Sign in
      </Button>
    </form>
  );
};

export default SignInForm;
