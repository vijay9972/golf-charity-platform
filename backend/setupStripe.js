require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const path = require('path');

async function setup() {
  try {
    console.log('Creating Stripe products and prices...');
    
    // Monthly Plan
    const monthlyProduct = await stripe.products.create({
      name: 'FairwayFund Monthly Plan',
      description: 'Subscribe to enter monthly draws and track scores.',
    });
    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 900, // £9.00
      currency: 'gbp',
      recurring: { interval: 'month' },
    });
    
    // Yearly Plan
    const yearlyProduct = await stripe.products.create({
      name: 'FairwayFund Yearly Plan',
      description: 'Subscribe for a year and save 20%.',
    });
    const yearlyPrice = await stripe.prices.create({
      product: yearlyProduct.id,
      unit_amount: 8600, // £86.00
      currency: 'gbp',
      recurring: { interval: 'year' },
    });
    
    console.log('Successfully created Stripe products!');
    console.log(`Monthly Price ID: ${monthlyPrice.id}`);
    console.log(`Yearly Price ID: ${yearlyPrice.id}`);
    
    // Update .env
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // check if they already exist
    if (envContent.includes('STRIPE_MONTHLY_PRICE_ID')) {
        envContent = envContent.replace(/STRIPE_MONTHLY_PRICE_ID=.*/g, `STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    } else {
        envContent += `\nSTRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`;
    }
    
    if (envContent.includes('STRIPE_YEARLY_PRICE_ID')) {
        envContent = envContent.replace(/STRIPE_YEARLY_PRICE_ID=.*/g, `STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);
    } else {
        envContent += `\nSTRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('Updated backend/.env with Stripe Price IDs.');
  } catch (err) {
    console.error('Error setting up Stripe:', err.message);
  }
}

setup();
