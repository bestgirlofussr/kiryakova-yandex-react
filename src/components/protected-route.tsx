import { getUser, getIsAuthChecked } from '@/services/user/reducer';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.ReactNode;
};

type LocationState = {
  from?: Location;
};

export const ProtectedRouteElement: React.FC<ProtectedProps> = ({
  onlyUnAuth = false,
  component,
}) => {
  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // for authorized, but unauthorized
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // for unauthorized, but authorized
    const state = location.state as LocationState | null;
    const from = state?.from ?? { pathname: '/' };
    return <Navigate to={from} />;
  }

  // for authorized, and authorized
  // for unauthorized, and unauthorized

  return component;
};
