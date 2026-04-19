import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';
import User from '../models/User.js';
import sendEmail from '../utils/emailConfig.js';
import Notification from '../models/Notification.js';

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;

    const doctorProfile = await DoctorProfile.findOne({ userId: doctorId });
    if (!doctorProfile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    // Check if slot is available
    const slotIndex = doctorProfile.availableSlots.findIndex(
      (slot) => slot.date === date && slot.startTime === timeSlot && !slot.isBooked
    );

    if (slotIndex === -1) {
      return res.status(400).json({ message: 'Time slot is not available' });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      timeSlot,
      reason,
    });

    if (appointment) {
      // Mark slot as booked
      doctorProfile.availableSlots[slotIndex].isBooked = true;
      await doctorProfile.save();

      // Notify Doctor via DB
      const newNotification = await Notification.create({
        userId: doctorId,
        message: `New appointment booked by ${req.user.name} for ${date} at ${timeSlot}`,
        relatedAppointmentId: appointment._id,
      });

      // Socket.IO Emit
      req.app.get('socketio').to(`user_${doctorId}`).emit('notification', newNotification);

      // Send Emails
      const doctorUser = await User.findById(doctorId);
      await sendEmail({
        email: req.user.email,
        subject: 'Appointment Booked Successfully',
        message: `Your appointment with Dr. ${doctorUser.name} is scheduled for ${date} at ${timeSlot}.`,
      });

      await sendEmail({
        email: doctorUser.email,
        subject: 'New Appointment Booking',
        message: `You have a new booking from ${req.user.name} on ${date} at ${timeSlot}.`,
      });

      res.status(201).json(appointment);
    } else {
      res.status(400).json({ message: 'Invalid appointment data' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Appointment creation failed' });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.user.role === 'admin') {
      // Admin sees all
    } else if (req.user.role === 'doctor') {
      query.doctorId = req.user._id;
    } else {
      query.patientId = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Appointment.countDocuments(query);

    if (req.query.page) {
      res.json({
        appointments,
        page,
        pages: Math.ceil(total / limit),
        total
      });
    } else {
      res.json(appointments);
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error fetching appointments' });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = req.body.status || appointment.status;
      
      if (req.body.status === 'confirmed' && !appointment.videoLink) {
        // Generate mock Video link
        appointment.videoLink = `https://mock-zoom.com/meet/${appointment._id}`;
      }

      const updatedAppointment = await appointment.save();

      // Notify Patient
      const patientUser = await User.findById(appointment.patientId);
      const newNotification = await Notification.create({
        userId: appointment.patientId,
        message: `Your appointment status has been updated to: ${req.body.status}`,
        relatedAppointmentId: appointment._id,
      });

      req.app.get('socketio').to(`user_${appointment.patientId}`).emit('notification', newNotification);

      await sendEmail({
        email: patientUser.email,
        subject: 'Appointment Status Updated',
        message: `Your appointment on ${appointment.date} is now ${req.body.status}.`,
      });

      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Status update failed' });
  }
};

// @desc    Upload prescription
// @route   POST /api/appointments/:id/prescription
// @access  Private (Doctor only)
const uploadPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.prescriptionFile = req.file ? req.file.path : appointment.prescriptionFile;
      appointment.diagnosisNotes = req.body.diagnosisNotes || appointment.diagnosisNotes;
      appointment.status = 'completed';
      
      const updatedAppointment = await appointment.save();

      // Notify Patient
      await Notification.create({
        userId: appointment.patientId,
        message: `Dr. ${req.user.name} has uploaded your prescription.`,
        relatedAppointmentId: appointment._id,
      });

      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message || 'Prescription upload failed' });
  }
};

// @desc    Generate prescription PDF dynamically
// @route   GET /api/appointments/:id/generate-prescription
// @access  Private (Doctor/Patient)
const generatePrescriptionPDF = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Use dynamic import since jspdf might be an ES module issue
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('CareSync Hospital', 105, 20, null, null, 'center');
    
    doc.setFontSize(16);
    doc.text('Prescription & Diagnosis Report', 105, 30, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Date: ${appointment.date}`, 20, 50);
    doc.text(`Doctor: Dr. ${appointment.doctorId?.name || 'N/A'}`, 20, 60);
    doc.text(`Patient: ${appointment.patientId?.name || 'N/A'}`, 20, 70);

    doc.setLineWidth(0.5);
    doc.line(20, 75, 190, 75);

    doc.text('Diagnosis & Notes:', 20, 90);
    
    const notes = doc.splitTextToSize(appointment.diagnosisNotes || 'No notes provided.', 170);
    doc.text(notes, 20, 100);

    doc.text('Signature: ________________', 140, 250);

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription_${appointment._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to generate PDF' });
  }
};

export {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  uploadPrescription,
  generatePrescriptionPDF,
};
