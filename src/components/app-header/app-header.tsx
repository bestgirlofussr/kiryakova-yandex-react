import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          {/* Тут должны быть ссылки, а не например кнопки или абзацы */}
          <NavLink to="/" className={styles.link}>
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
                >
                  Конструктор
                </p>
              </>
            )}
          </NavLink>
          <NavLink to="/feed" className={`${styles.link} ml-10`}>
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p
                  className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
                >
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <NavLink to="/profile" className={`${styles.link} ${styles.link_position_last}`}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
              >
                Личный кабинет
              </p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};
