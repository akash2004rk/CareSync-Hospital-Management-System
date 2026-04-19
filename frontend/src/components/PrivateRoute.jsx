import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar.jsx';
import PageTransition from './PageTransition.jsx';

function PrivateRoute({ role }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return (
    <div className="app-layout">
      <Sidebar role={user.role} user={user} />
      <div className="main-content" style={{ overflowX: 'hidden' }}>
        <AnimatePresence mode="sync">
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PrivateRoute;
