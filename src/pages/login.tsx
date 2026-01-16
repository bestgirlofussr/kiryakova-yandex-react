import { useForm } from '@/hooks/useForm';
import { useValidation } from '@/hooks/useValidation';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { login } from '@/services/user/actions';
import { getUserLoading } from '@/services/user/reducer';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { ChangeEvent } from 'react';

type LoginForm = {
  email: string;
  password: string;
};

export const Login = (): React.JSX.Element => {
  const { values, handleChange } = useForm<LoginForm>({ email: '', password: '' });

  const { errors, hasErrors, validate } = useValidation();

  const dispatch = useAppDispatch();

  const isUserLoading = useAppSelector(getUserLoading);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!hasErrors() && !isUserLoading) {
      console.log('Отправка:', values);
      void dispatch(login(values));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    handleChange(e);
    validate(e);
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Вход</h2>

      <form onSubmit={handleSubmit} className="content-centered">
        <Input
          extraClass="mb-6"
          error={!!errors.email}
          errorText={errors.email}
          name="email"
          onChange={onChange}
          placeholder="E-mail"
          size="default"
          type="email"
          value={values.email}
        />

        <Input
          extraClass="mb-6"
          name="password"
          onChange={onChange}
          placeholder="Пароль"
          size="default"
          type="password"
          value={values.password}
          icon="ShowIcon"
        />

        <Button
          extraClass="mb-20"
          htmlType="submit"
          disabled={hasErrors() || isUserLoading}
        >
          Войти
        </Button>

        <div className="mb-4">
          <span className="text text_type_main-default text_color_inactive mr-1">
            Вы - новый пользователь?
          </span>
          <Link to="/register" className="text text_type_main-default">
            Зарегистрироваться
          </Link>
        </div>
        <div>
          <span className="text text_type_main-default text_color_inactive mr-1">
            Забыли пароль?
          </span>
          <Link to="/forgot-password" className="text text_type_main-default">
            Восстановить пароль
          </Link>
        </div>
      </form>
    </main>
  );
};
