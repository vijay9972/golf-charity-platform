const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const supabase = require('../config/supabase');

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private
const createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body; 
    
    // Check if we are using the placeholder from .env
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'your_stripe_key' || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
      console.log('Using mock payment bypass since no real Stripe keys are configured.');
      
      // Instantly auto-subscribe the user for testing purposes
      await supabase.from('profiles').update({ is_subscribed: true }).eq('id', req.user.id);
      
      // Return URL to just redirect straight back to the dashboard
      return res.json({ url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?mock_success=true` });
    }

    const priceId = plan === 'yearly' ? process.env.STRIPE_YEARLY_PRICE_ID : process.env.STRIPE_MONTHLY_PRICE_ID;
    const finalPriceId = priceId || (plan === 'yearly' ? 'price_yearly_mock' : 'price_monthly_mock');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      client_reference_id: req.user.id,
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    // If webhook secret isn't provided (e.g., local dev), we can mock the event validation or fail
    if (!endpointSecret) {
      // Mock parsing for local bypass if desired, but best practice is to fail
      event = JSON.parse(req.body.toString()); 
    } else {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.client_reference_id;
      
      if (userId) {
        await supabase.from('profiles').update({ is_subscribed: true }).eq('id', userId);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.send();
};

module.exports = { createCheckoutSession, handleWebhook };
