import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import DoctorProfile from '../models/DoctorProfile.js';

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
const getAdminAnalytics = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const range = req.query.range || '7d';
    
    // Default to today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = await Appointment.countDocuments({ date: todayStr });
    
    const completedAppointments = await Appointment.find({ status: 'completed' });
    
    // Dynamic Real Revenue Calculation
    const docProfiles = await DoctorProfile.find({});
    const feeMap = {};
    docProfiles.forEach(doc => feeMap[doc.userId.toString()] = doc.consultationFee);
    
    let revenue = 0;
    completedAppointments.forEach(appt => {
      revenue += (feeMap[appt.doctorId.toString()] || 500);
    });

    // Chart data based on range
    let dataPoints = 7;
    let step = 1; // 1 day
    if (range === '30d') { dataPoints = 30; }
    else if (range === '12m') { dataPoints = 12; step = 30; } // Approx months

    const chartLabels = [...Array(dataPoints)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (i * step));
      if (range === '12m') {
        return d.toISOString().substring(0, 7); // YYYY-MM
      }
      return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = await Promise.all(chartLabels.map(async (label) => {
      // If month, search by regex
      const query = range === '12m' ? { date: { $regex: `^${label}` } } : { date: label };
      const count = await Appointment.countDocuments(query);
      return { date: label, appointments: count };
    }));

    // Status distribution
    const pending = await Appointment.countDocuments({ status: 'pending' });
    const confirmed = await Appointment.countDocuments({ status: 'confirmed' });
    const cancelled = await Appointment.countDocuments({ status: 'cancelled' });
    const completed = completedAppointments.length;

    res.json({
      stats: {
        totalPatients,
        totalDoctors,
        todayAppointments,
        revenue,
      },
      chartData,
      statusDistribution: [
        { name: 'Pending', value: pending },
        { name: 'Confirmed', value: confirmed },
        { name: 'Cancelled', value: cancelled },
        { name: 'Completed', value: completed },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Analytics fetch failed' });
  }
};

// @desc    Get doctor analytics
// @route   GET /api/analytics/doctor
// @access  Private (Doctor)
const getDoctorAnalytics = async (req, res) => {
  const doctorId = req.user._id;

  const appointments = await Appointment.find({ doctorId });
  
  // Total unique patients
  const uniquePatientIds = [...new Set(appointments.map(a => a.patientId.toString()))];
  const totalPatients = uniquePatientIds.length;

  // Today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today).length;

  // Pending reports (completed but missing prescription)
  // or generally pending/confirmed ones
  const pendingReports = appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length;

  res.json({
    totalPatients,
    todayAppointments,
    pendingReports,
  });
};

// @desc    Get public analytics for landing page
// @route   GET /api/analytics/public
// @access  Public
const getPublicStats = async (req, res) => {
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await User.countDocuments({ role: 'doctor' });
  res.json({
    totalPatients,
    totalDoctors,
    successRate: 98 // System-wide constant metric
  });
};

export { getAdminAnalytics, getDoctorAnalytics, getPublicStats };
