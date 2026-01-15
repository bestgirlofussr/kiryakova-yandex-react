import { useForm } from '@/hooks/useForm';
import { useValidation } from '@/hooks/useValidation';
import { useAppDispatch } from '@/services/store';
import { checkUserAuth, resetPasswordEmail } from '@/services/user/actions';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type ResetPasswordForm = {
  password: string;
  code: string;
};

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { values, handleChange } = useForm<ResetPasswordForm>({
    password: '',
    code: '',
  });

  const { errors, hasErrors, validate } = useValidation();

  useEffect(() => {
    const forgotFlag = localStorage.getItem(LOCAL_STORAGE_KEYS.forgotPassword);

    if (!forgotFlag) {
      void navigate('/not-found', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!hasErrors()) {
      console.log('Отправка:', values);
      void resetPasswordEmail(values).then(() => dispatch(checkUserAuth()));
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
          name="password"
          error={!!errors.password}
          errorText={errors.password}
          onChange={onChange}
          placeholder="Введите новый пароль"
          size="default"
          type="password"
          value={values.password}
          icon="ShowIcon"
        />
        <Input
          extraClass="mb-6"
          name="code"
          error={!!errors.code}
          errorText={errors.code}
          onChange={onChange}
          placeholder="Введите код из письма"
          size="default"
          type="text"
          value={values.code}
        />

        <Button extraClass="mb-20" htmlType="submit" disabled={hasErrors()}>
          Сохранить
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
