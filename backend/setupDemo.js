require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDemo() {
  console.log('Seeding Demo Data...');
  try {
    // 1. Seed Charities
    const charities = [
      {
        name: 'Global Golf Foundation',
        description: 'Bringing the game of golf to underprivileged communities worldwide and providing youth with equipment and coaching.',
        location: 'Global',
        category: 'Youth Sports'
      },
      {
        name: 'Fairway Green Initiative',
        description: 'Dedicated to making golf courses more environmentally friendly and promoting sustainable practices in turf management.',
        location: 'International',
        category: 'Environment'
      },
      {
        name: 'Birdies for Good',
        description: 'Using golf tournaments to raise funds for local healthcare initiatives and cancer research.',
        location: 'United States',
        category: 'Healthcare'
      }
    ];

    console.log('Inserting charities...');
    for (const charity of charities) {
      // Check if exists
      const { data: existing } = await supabase.from('charities').select('*').eq('name', charity.name).single();
      if (!existing) {
        await supabase.from('charities').insert([charity]);
        console.log(`Added: ${charity.name}`);
      } else {
        console.log(`Skipped (already exists): ${charity.name}`);
      }
    }

    // 2. Bypass Paywall for all users so they can see the Dashboard
    console.log('Unlocking complete dashboard access for all registered users...');
    const { data: profiles, error: profileErr } = await supabase.from('profiles').select('*');
    if (profileErr) throw profileErr;

    for (const profile of profiles) {
      if (!profile.is_subscribed) {
        await supabase.from('profiles').update({ is_subscribed: true }).eq('id', profile.id);
        console.log(`Unlocked dashboard for user: ${profile.id}`);
      }
    }

    console.log('✅ Demo Setup Complete! You can now access the charities and the main dashboard.');
  } catch (err) {
    console.error('Error during demo setup:', err.message);
  }
}

setupDemo();
