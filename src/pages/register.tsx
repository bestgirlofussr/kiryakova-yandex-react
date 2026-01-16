import { useForm } from '@/hooks/useForm';
import { useValidation } from '@/hooks/useValidation';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { register } from '@/services/user/actions';
import { getUserLoading } from '@/services/user/reducer';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { ChangeEvent } from 'react';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const Register = (): React.JSX.Element => {
  const { values, handleChange } = useForm<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });

  const isUserLoading = useAppSelector(getUserLoading);

  const dispatch = useAppDispatch();
  const { errors, hasErrors, validate } = useValidation();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!hasErrors() && !isUserLoading) {
      console.log('Отправка:', values);
      void dispatch(register(values));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    handleChange(e);
    validate(e);
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Регистрация</h2>

      <form onSubmit={handleSubmit} className="content-centered">
        <Input
          extraClass="mb-6"
          name="name"
          error={!!errors.name}
          errorText={errors.name}
          onChange={onChange}
          placeholder="Имя"
          size="default"
          type="text"
          value={values.name}
        />
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
          error={!!errors.password}
          errorText={errors.password}
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
          Зарегистрироваться
        </Button>

        <div>
          <span className="text text_type_main-default text_color_inactive mr-1">
            Уже зарегистрированы?
          </span>
          <Link to="/login" className="text text_type_main-default">
            Войти
          </Link>
        </div>
      </form>
    </main>
  );
};
