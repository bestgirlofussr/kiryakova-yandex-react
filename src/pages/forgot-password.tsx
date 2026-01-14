import { sendForgotPasswordEmail } from '@/services/user/actions';
import { validateEmail } from '@/utils/validation';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const ForgotPassword = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (e: React.FocusEvent<HTMLInputElement, Element>): void => {
    const { name, value } = e.target;

    if (name === 'email') {
      const error = validateEmail(value);
      setEmailError(error);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!emailError && formData.email) {
      console.log('Отправка:', formData);
      void sendForgotPasswordEmail(formData).then(() => navigate('/reset-password'));
    }
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Восстановление пароля</h2>

      <form onSubmit={handleSubmit} className="content-centered">
        <Input
          extraClass="mb-6"
          error={!!emailError}
          errorText={emailError || 'Неправильный e-mail'}
          name="email"
          onChange={onChange}
          onBlur={validate}
          placeholder="E-mail"
          size="default"
          type="email"
          value={formData.email}
        />

        <Button
          extraClass="mb-20"
          htmlType="submit"
          disabled={!!emailError || !formData.email}
        >
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
