import { useForm } from '@/hooks/useForm';
import { useValidation } from '@/hooks/useValidation';
import { sendForgotPasswordEmail } from '@/services/user/actions';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import type { ChangeEvent } from 'react';

type ForgotPasswordForm = {
  email: string;
};

export const ForgotPassword = (): React.JSX.Element => {
  const { values, handleChange } = useForm<ForgotPasswordForm>({ email: '' });

  const { errors, hasErrors, validate } = useValidation();

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!hasErrors()) {
      console.log('Отправка:', values);
      void sendForgotPasswordEmail(values).then(() => navigate('/reset-password'));
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    handleChange(e);
    validate(e);
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>

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

        <Button extraClass="mb-20" htmlType="submit" disabled={hasErrors()}>
          Восстановить
        </Button>

        <div>
          <span className="text text_type_main-default text_color_inactive mr-1">
            Вспомнили пароль?
          </span>
          <Link to="/login" className="text text_type_main-default">
            Войти
          </Link>
        </div>
      </form>
    </main>
  );
};
