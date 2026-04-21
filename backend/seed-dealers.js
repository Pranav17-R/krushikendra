// ============================================================
//  backend/seed-dealers.js
//  Run: node backend/seed-dealers.js
//  Seeds the authorized dealer list into MongoDB Atlas.
// ============================================================
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Dealer   = require('./models/Dealer');

const dealers = [
  {
    name:     'Shri Ganesh Krishi Seva Kendra',
    emoji:    '🌾',
    village:  'Shirpur',
    district: 'nashik',
    areas:    ['Shirpur', 'Dindori', 'Peth'],
    contact:  '9876543210',
    since:    2010,
    verified: true,
    status:   'active',
  },
  {
    name:     'Mauli Agri Traders',
    emoji:    '🌱',
    village:  'Rahuri',
    district: 'ahmednagar',
    areas:    ['Rahuri', 'Newasa', 'Shrirampur'],
    contact:  '9765432109',
    since:    2013,
    verified: true,
    status:   'active',
  },
  {
    name:     'Jai Shivray Krishi Center',
    emoji:    '🏪',
    village:  'Satara',
    district: 'satara',
    areas:    ['Satara', 'Karad', 'Wai'],
    contact:  '9654321098',
    since:    2015,
    verified: true,
    status:   'active',
  },
  {
    name:     'Kisaan Agri Store',
    emoji:    '🌿',
    village:  'Baramati',
    district: 'pune',
    areas:    ['Baramati', 'Daund', 'Indapur'],
    contact:  '9543210987',
    since:    2012,
    verified: true,
    status:   'active',
  },
  {
    name:     'Shubham Krishi Udyog',
    emoji:    '🌻',
    village:  'Kolhapur',
    district: 'kolhapur',
    areas:    ['Kolhapur', 'Ichalkaranji', 'Kagal'],
    contact:  '9432109876',
    since:    2017,
    verified: true,
    status:   'active',
  },
  {
    name:     'Annadata Agro Services',
    emoji:    '🌾',
    village:  'Solapur',
    district: 'solapur',
    areas:    ['Solapur', 'Pandharpur', 'Barshi'],
    contact:  '9321098765',
    since:    2016,
    verified: true,
    status:   'active',
  },
  {
    name:     'Prathmesh Krishi Seva',
    emoji:    '🌱',
    village:  'Junnar',
    district: 'pune',
    areas:    ['Junnar', 'Ambegaon', 'Otur'],
    contact:  '9210987654',
    since:    2018,
    verified: true,
    status:   'active',
  },
  {
    name:     'New Maharashtra Agri Center',
    emoji:    '🏪',
    village:  'Lasalgaon',
    district: 'nashik',
    areas:    ['Lasalgaon', 'Niphad', 'Chandwad'],
    contact:  '9109876543',
    since:    2011,
    verified: true,
    status:   'active',
  },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    let inserted = 0;
    let skipped  = 0;

    for (const d of dealers) {
      // Use name + village as unique key to avoid duplicates
      const exists = await Dealer.findOne({ name: d.name, village: d.village });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${d.name}, ${d.village}`);
        skipped++;
        continue;
      }
      await Dealer.create(d);
      console.log(`✅ Inserted: ${d.name} (${d.village}, ${d.district})`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('❌ Error seeding dealers:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
