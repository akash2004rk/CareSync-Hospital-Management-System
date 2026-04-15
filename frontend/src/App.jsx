import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchUser } from './store/authSlice.js';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageDoctors from './pages/admin/ManageDoctors.jsx';
import ManagePatients from './pages/admin/ManagePatients.jsx';
import AdminAnalytics from './pages/admin/AdminAnalytics.jsx';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx';
import DoctorProfile from './pages/doctor/DoctorProfile.jsx';
import DoctorSlots from './pages/doctor/DoctorSlots.jsx';

// Patient
import PatientDashboard from './pages/patient/PatientDashboard.jsx';
import BookAppointment from './pages/patient/BookAppointment.jsx';
import PatientRecords from './pages/patient/PatientRecords.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route path="/admin" element={<PrivateRoute role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="doctors" element={<ManageDoctors />} />
        <Route path="patients" element={<ManagePatients />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>

      {/* Doctor */}
      <Route path="/doctor" element={<PrivateRoute role="doctor" />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="profile" element={<DoctorProfile />} />
        <Route path="slots" element={<DoctorSlots />} />
      </Route>

      {/* Patient */}
      <Route path="/patient" element={<PrivateRoute role="patient" />}>
        <Route index element={<PatientDashboard />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="records" element={<PatientRecords />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
