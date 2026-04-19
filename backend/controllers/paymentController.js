import Stripe from 'stripe';
import Appointment from '../models/Appointment.js';
import DoctorProfile from '../models/DoctorProfile.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-checkout-session
// @access  Private (Patient)
const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    const doctorProfile = await DoctorProfile.findOne({ userId: appointment.doctorId });
    const fee = doctorProfile?.consultationFee || 500;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Consultation with Doctor Fee`,
              description: `Appointment on ${appointment.date} at ${appointment.timeSlot}`,
            },
            unit_amount: fee * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payments/cancel`,
      metadata: {
        appointmentId: appointment._id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Payment session creation failed' });
  }
};

export { createCheckoutSession };
