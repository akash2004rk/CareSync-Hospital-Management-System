import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  uploadPrescription,
  generatePrescriptionPDF,
} from '../controllers/appointmentController.js';
import { protect, doctor } from '../middleware/authMiddleware.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.get('/', protect, getAppointments);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointmentStatus);
router.post(
  '/:id/prescription',
  protect,
  doctor,
  upload.single('prescription'),
  uploadPrescription
);
router.get('/:id/generate-prescription', protect, generatePrescriptionPDF);

export default router;
