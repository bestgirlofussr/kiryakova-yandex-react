import { Link } from 'react-router-dom';

export const NotFound = (): React.JSX.Element => {
  return (
    <main className="content-centered mt-30">
      <h1 className="text text_type_main-large mb-6">404 - Страница не найдена</h1>
      <p className="text text_type_main-medium text_color_inactive mb-6">
        Запрашиваемая страница не существует
      </p>
      <Link to="/" className="text text_type_main-default">
        Вернуться на главную
      </Link>
    </main>
  );
};
