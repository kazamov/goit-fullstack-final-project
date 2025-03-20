import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import * as yup from 'yup';

import Button from '../../../../ui/Button/Button';

import styles from './SignUpForm.module.css';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

type FormData = {
  name: string;
  email: string;
  password: string;
};

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({ resolver: yupResolver(schema), mode: 'onChange' });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
  };

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
            {...register('name')}
          />
          {!!errors.name && (
            <span className="inputIcon">
              ⓘ<span className="inputIconTooltip">{errors.name?.message}</span>
            </span>
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
            type="email"
            placeholder="Email*"
            {...register('email')}
          />
          {!!errors.email && (
            <span className="inputIcon">
              ⓘ<span className="inputIconTooltip">{errors.email?.message}</span>
            </span>
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
            <span className="inputIcon">
              ⓘ
              <span className="inputIconTooltip">
                {errors.password?.message}
              </span>
            </span>
          )}
        </div>
      </div>
      <Button kind="secondary" type="submit" disabled={!isValid}>
        Create
      </Button>
    </form>
  );
};

export default SignUpForm;
