import { useAppDispatch } from '@/services/store';
import { logout } from '@/services/user/actions';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Logout = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    void dispatch(logout()).then(() => navigate('/login', { replace: true }));
  }, []);

  return <></>;
};
