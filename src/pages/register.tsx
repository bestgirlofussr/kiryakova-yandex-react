import { useAppDispatch, useAppSelector } from '@/services/store';
import { register } from '@/services/user/actions';
import { getUserLoading } from '@/services/user/reducer';
import { validateEmail } from '@/utils/validation';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const isUserLoading = useAppSelector(getUserLoading);

  const dispatch = useAppDispatch();
  const [emailError, setEmailError] = useState('');

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
    if (!emailError && formData.email && formData.password && !isUserLoading) {
      console.log('Отправка:', formData);
      void dispatch(register(formData));
    }
  };

  return (
    <main className="container-centered">
      <h2 className="text text_type_main-medium mb-6">Регистрация</h2>

      <form onSubmit={handleSubmit} className="content-centered">
        <Input
          extraClass="mb-6"
          name="name"
          onChange={onChange}
          placeholder="Имя"
          size="default"
          type="text"
          value={formData.name}
        />
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

        <Input
          extraClass="mb-6"
          name="password"
          onChange={onChange}
          placeholder="Пароль"
          size="default"
          type="password"
          value={formData.password}
          icon="ShowIcon"
        />

        <Button
          extraClass="mb-20"
          htmlType="submit"
          disabled={
            !!emailError ||
            !formData.email ||
            !formData.password ||
            !formData.name ||
            isUserLoading
          }
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
