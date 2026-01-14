import { useAppDispatch } from '@/services/store';
import { checkUserAuth, resetPasswordEmail } from '@/services/user/actions';
import { LOCAL_STORAGE_KEYS } from '@/utils/constants';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState, type ChangeEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    password: '',
    code: '',
  });

  useEffect(() => {
    const forgotFlag = localStorage.getItem(LOCAL_STORAGE_KEYS.forgotPassword);

    if (!forgotFlag) {
      void navigate('/not-found', { replace: true });
    }
  }, [navigate]);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (formData.password && formData.code) {
      console.log('Отправка:', formData);
      void resetPasswordEmail(formData).then(() => dispatch(checkUserAuth()));
    }
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>

      <form onSubmit={handleSubmit} className="content-centered">
        <Input
          extraClass="mb-6"
          name="password"
          onChange={onChange}
          placeholder="Введите новый пароль"
          size="default"
          type="password"
          value={formData.password}
          icon="ShowIcon"
        />
        <Input
          extraClass="mb-6"
          name="code"
          onChange={onChange}
          placeholder="Введите код из письма"
          size="default"
          type="text"
          value={formData.code}
        />

        <Button
          extraClass="mb-20"
          htmlType="submit"
          disabled={!formData.password || !formData.code}
        >
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
