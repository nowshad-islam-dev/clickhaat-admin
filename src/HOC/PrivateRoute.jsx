// PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
