import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

function PrivateRoute({ role }) {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return (
    <div className="app-layout">
      <Sidebar role={user.role} user={user} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default PrivateRoute;
