import { useForm } from '@/hooks/useForm';
import { useValidation } from '@/hooks/useValidation';
import { useAppDispatch, useAppSelector } from '@/services/store';
import { updateUser } from '@/services/user/actions';
import { getUser, getUserLoading } from '@/services/user/reducer';
import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type ChangeEvent } from 'react';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './profile.module.css';

type ProfileEditForm = {
  name: string;
  email: string;
  password: string;
};

export const ProfileEdit = (): React.JSX.Element => {
  const { values, setValues, handleChange } = useForm<ProfileEditForm>({
    name: '',
    email: '',
    password: '',
  });

  const { errors, validate } = useValidation();

  const [isDirty, setIsDirty] = useState(false);

  const isUserLoading = useAppSelector(getUserLoading);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getUser);

  useEffect(() => {
    if (currentUser && !isDirty) {
      setValues({
        email: currentUser.email,
        name: currentUser.name,
        password: '',
      });
    }
  }, [currentUser, isDirty]);

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    handleChange(e);
    validate(e);
    setIsDirty(true);
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (
      !errors.email &&
      !errors.name &&
      (!values.password || !errors.password) &&
      !isUserLoading
    ) {
      console.log('Отправка:', values);
      void dispatch(updateUser(values)).then(() => setIsDirty(false));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form}`}>
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
        icon="EditIcon"
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
        icon="EditIcon"
      />
      <Input
        extraClass="mb-6"
        name="password"
        onChange={onChange}
        placeholder="Пароль"
        size="default"
        type="password"
        value={values.password}
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
            disabled={
              !!errors.email ||
              !!errors.name ||
              !!(values.password && errors.password) ||
              isUserLoading
            }
          >
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
