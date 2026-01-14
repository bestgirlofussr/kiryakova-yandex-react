import { useAppDispatch, useAppSelector } from '@/services/store';
import { updateUser } from '@/services/user/actions';
import { getUser, getUserLoading } from '@/services/user/reducer';
import { validateEmail } from '@/utils/validation';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type ChangeEvent } from 'react';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './profile.module.css';

export const ProfileEdit = (): React.JSX.Element => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [emailError, setEmailError] = useState('');

  const [isDirty, setIsDirty] = useState(false);

  const isUserLoading = useAppSelector(getUserLoading);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getUser);

  useEffect(() => {
    if (currentUser && !isDirty) {
      setFormData((prev) => ({
        ...prev,
        email: currentUser.email,
        name: currentUser.name || prev.name,
        password: '',
      }));
    }
  }, [currentUser, isDirty]);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
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
    if (!emailError && formData.email && formData.name && !isUserLoading) {
      console.log('Отправка:', formData);
      void dispatch(updateUser(formData)).then(() => setIsDirty(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form}`}>
      <Input
        extraClass="mb-6"
        name="name"
        onChange={onChange}
        placeholder="Имя"
        size="default"
        type="text"
        value={formData.name}
        icon="EditIcon"
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
        icon="EditIcon"
      />
      <Input
        extraClass="mb-6"
        name="password"
        onChange={onChange}
        placeholder="Пароль"
        size="default"
        type="password"
        value={formData.password}
        icon="EditIcon"
      />
      {isDirty && (
        <div className={styles.footer}>
          <a
            className="text text_type_main-default mr-5"
            onClick={(e) => {
              e.preventDefault();
              setIsDirty(false);
            }}
          >
            Отмена
          </a>
          <Button
            htmlType="submit"
            disabled={!!emailError || !formData.email || !formData.name || isUserLoading}
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
