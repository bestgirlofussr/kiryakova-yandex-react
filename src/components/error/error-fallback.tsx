import { Button } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

type FallbackProps = {
  error: Error; // Ошибка
  resetErrorBoundary: () => void; // Функция сброса
};

export const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="mt-10 mb-5 pl-5">
    <h1 className="text text_type_main-large mb-5">🛸 Что-то пошло не так</h1>
    <pre className="text text_type_main-default mb-5">{error.message}</pre>
    <Button onClick={resetErrorBoundary} htmlType="button">
      Попробовать снова
    </Button>
  </div>
);

export default ErrorFallback;
