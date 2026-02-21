import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import {
  ForgotPassword,
  Home,
  Ingredient,
  Login,
  Logout,
  NotFound,
  Profile,
  ProfileEdit,
  Register,
  ResetPassword,
  Order,
  Feed,
  ProfileFeed,
} from '@/pages';
import { checkUserAuth } from '@/services/user/actions';
import { getUserError, resetUserError } from '@/services/user/reducer';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { Modal } from '@components/modal/modal';
import { OrderCompositionModal } from '@components/order-composition-modal/order-composition-modal';
import { ProtectedRouteElement as Protected } from '@components/protected-route';
import { fetchIngredients } from '@services/burger-ingredients/actions';
import {
  getIngredientsError,
  getIngredientsLoading,
  resetIngredientsError,
} from '@services/burger-ingredients/reducer';
import { useAppDispatch, useAppSelector } from '@services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const loading = useAppSelector(getIngredientsLoading);
  const fetchError = useAppSelector(getIngredientsError);
  const authError = useAppSelector(getUserError);

  const dispatch = useAppDispatch();

  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  const navigate = useNavigate();

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, []);

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, []);

  const onClose = useCallback(() => {
    if (state?.backgroundLocation) {
      void navigate(state?.backgroundLocation);
    } else {
      void navigate(-1);
    }
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {loading ? (
        <Preloader />
      ) : fetchError || authError ? (
        <Modal
          isOpen={true}
          onClose={() => {
            if (fetchError) dispatch(resetIngredientsError());
            if (authError) dispatch(resetUserError());
          }}
        >
          <div className="error">
            <p className="text text_type_main-default">
              {fetchError?.message ?? authError?.message ?? 'Произошла ошибка'}
            </p>
          </div>
        </Modal>
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

              <Route
                path="/profile/orders/:number"
                element={
                  <Protected component={<OrderCompositionModal onClose={onClose} />} />
                }
              />

              <Route
                path="/feed/:number"
                element={<OrderCompositionModal onClose={onClose} />}
              />
            </Routes>
          )}
          <Routes location={state?.backgroundLocation ?? location}>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Protected onlyUnAuth component={<Login />} />}
            />
            <Route
              path="/register"
              element={<Protected onlyUnAuth component={<Register />} />}
            />
            <Route
              path="/forgot-password"
              element={<Protected onlyUnAuth component={<ForgotPassword />} />}
            />
            <Route
              path="/reset-password"
              element={<Protected onlyUnAuth component={<ResetPassword />} />}
            />
            <Route path="/profile" element={<Protected component={<Profile />} />}>
              <Route index element={<ProfileEdit />} />
              <Route path="orders" element={<ProfileFeed />} />
            </Route>
            <Route
              path="/profile/orders/:number"
              element={<Protected component={<Order />} />}
            />

            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/:number" element={<Order />} />
            <Route path="/ingredients/:id" element={<Ingredient />} />
            <Route path="logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
