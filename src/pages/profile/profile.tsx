import { useMemo } from 'react';
import { matchPath, NavLink, Outlet, useLocation } from 'react-router-dom';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './profile.module.css';

export const Profile = (): React.JSX.Element => {
  const { pathname } = useLocation();

  const navLinks = useMemo(
    () => [
      {
        title: 'Профиль',
        to: '/profile',
        end: true,
        info: 'В этом разделе вы можете изменить свои персональные данные',
      },
      {
        title: 'История заказов',
        to: '/profile/orders',
        end: false,
        info: 'В этом разделе вы можете просмотреть свою историю заказов',
      },
      {
        title: 'Выход',
        to: '/logout',
      },
    ],
    []
  );

  const currentLink = useMemo(() => {
    return navLinks.find((link) => matchPath(link.to, pathname));
  }, [pathname]);

  return (
    <main className={`${styles.main} pl-5 pr-5`}>
      <div className={`${styles.nav} mr-15`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `${styles.navlink} text text_type_main-medium ${isActive ? `${styles.navlink_active}` : ''}`
            }
          >
            {link.title}
          </NavLink>
        ))}

        {currentLink && (
          <p className={`mt-20 text_type_main-default ${styles.info}`}>
            {currentLink.info}
          </p>
        )}
      </div>
      <Outlet />
    </main>
  );
};
