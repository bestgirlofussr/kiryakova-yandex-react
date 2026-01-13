import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { Home } from '@/pages';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { ErrorFallback } from '@components/error/error-fallback';
import { Modal } from '@components/modal/modal';
import { fetchIngredients } from '@services/burger-ingredients/actions';
import {
  getIngredientsError,
  getIngredientsLoading,
  resetError,
} from '@services/burger-ingredients/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const loading = useAppSelector(getIngredientsLoading);
  const error = useAppSelector(getIngredientsError);

  const dispatch = useAppDispatch();

  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const navigate = useNavigate();

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, []);

  const onClose = (): void => {
    if (state?.backgroundLocation) {
      void navigate(state?.backgroundLocation);
    } else {
      void navigate(-1);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {loading ? (
        <Preloader />
      ) : error ? (
        <ErrorFallback error={error} resetErrorBoundary={() => dispatch(resetError())} />
      ) : (
        <>
          {state?.backgroundLocation && (
            <Routes location={location}>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal header="Детали ингредиента" isOpen={true} onClose={onClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
            </Routes>
          )}
          <Routes location={state?.backgroundLocation ?? location}>
            <Route path="/" element={<Home />} />
            <Route
              path="/ingredients/:id"
              element={
                <div className={styles.ingredient}>
                  <h2 className="text text_type_main-large">Детали ингредиента</h2>
                  <IngredientDetails />
                </div>
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
