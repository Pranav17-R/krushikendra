// ============================================================
//  backend/seed-products.js
//  Run: node backend/seed-products.js
//  Seeds the real product catalogue into MongoDB.
// ============================================================
require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product  = require('./models/Product');

// ── Category mapping from user data → schema enum ───────────
// Schema enums: 'organic' | 'chemical' | 'pesticide' | 'crop-protection'
const products = [
  // ── Pesticides / Insecticides ──────────────────────────────
  {
    name:        'Mera 71',
    slug:        'mera-71',
    category:    'pesticide',
    emoji:       '🦟',
    description: 'Controls sucking pests and larvae in crops. Effective broad-action insecticide for field crops.',
    company:     '',
    tags:        ['insecticide', 'sucking pests', 'larvae', '100 gm'],
    benefits:    ['Controls sucking pests', 'Kills larvae', 'Fast acting'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Garud',
    slug:        'garud',
    category:    'pesticide',
    emoji:       '🦅',
    description: 'Broad-spectrum insecticide for comprehensive pest control across a wide range of crops.',
    company:     '',
    tags:        ['insecticide', 'broad-spectrum', '1 L'],
    benefits:    ['Wide pest coverage', 'Broad-spectrum action', 'Field tested'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Tata Bahar',
    slug:        'tata-bahar',
    category:    'pesticide',
    emoji:       '🌱',
    description: 'Effective insecticide by Tata Chemicals for reliable pest control in multiple crop types.',
    company:     'Tata Chemicals',
    tags:        ['insecticide', '1 L', '500 ml', '250 ml'],
    benefits:    ['Trusted brand', 'Multiple pack sizes', 'Reliable pest control'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Barazide',
    slug:        'barazide',
    category:    'pesticide',
    emoji:       '🐛',
    description: 'Controls a wide range of pests effectively. Suitable for multiple crop types and pest profiles.',
    company:     '',
    tags:        ['insecticide', 'wide spectrum', '1 L', '500 ml'],
    benefits:    ['Wide range pest control', 'Multiple pack sizes', 'Cost effective'],
    stock:       'In Stock',
    status:      'active',
  },

  // ── Herbicides ─────────────────────────────────────────────
  {
    name:        'Sweep Power',
    slug:        'sweep-power',
    category:    'pesticide',
    emoji:       '🌾',
    description: 'Herbicide for controlling unwanted weeds in fields and agricultural land.',
    company:     '',
    tags:        ['herbicide', 'weed control', '1 L'],
    benefits:    ['Eliminates weeds', 'Protects crop space', 'Easy to apply'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Targa Super',
    slug:        'targa-super',
    category:    'pesticide',
    emoji:       '🌿',
    description: 'Selective herbicide by UPL Limited that targets and controls grassy weeds without harming crops.',
    company:     'UPL Limited',
    tags:        ['herbicide', 'selective', 'grassy weeds', '1 L', '500 ml'],
    benefits:    ['Selective weed control', 'Crop-safe formulation', 'Trusted by UPL'],
    stock:       'In Stock',
    status:      'active',
  },

  // ── Crop Protection / Fungicides ──────────────────────────
  {
    name:        'Ferio',
    slug:        'ferio',
    category:    'crop-protection',
    emoji:       '🍃',
    description: 'Fungicide that protects crops from fungal diseases, ensuring healthy plant growth and yield.',
    company:     '',
    tags:        ['fungicide', 'disease control', '1 L'],
    benefits:    ['Prevents fungal infection', 'Promotes healthy growth', 'Long lasting'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Milquate',
    slug:        'milquate',
    category:    'crop-protection',
    emoji:       '🍀',
    description: 'Effective fungicide for controlling mildew and fungal infections in vegetables and field crops.',
    company:     '',
    tags:        ['fungicide', 'mildew control', '1 L'],
    benefits:    ['Controls mildew', 'Prevents fungal spread', 'Crop safe'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Blue Copper',
    slug:        'blue-copper',
    category:    'crop-protection',
    emoji:       '🔵',
    description: 'Copper-based fungicide providing broad-spectrum protection against various fungal diseases.',
    company:     '',
    tags:        ['fungicide', 'copper-based', '500 gm'],
    benefits:    ['Copper-based protection', 'Broad fungal control', 'Soil friendly'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Cabrio Top',
    slug:        'cabrio-top',
    category:    'crop-protection',
    emoji:       '🌺',
    description: 'Premium systemic fungicide by BASF for fruits and vegetables. Provides dual-mode protection against key diseases.',
    company:     'BASF',
    tags:        ['fungicide', 'premium', 'fruits', 'vegetables', '300 gm', '600 gm'],
    benefits:    ['Premium BASF formula', 'Dual-mode action', 'Ideal for fruits & vegetables'],
    stock:       'In Stock',
    featured:    true,
    status:      'active',
  },

  // ── Fertilizers / Growth Promoters ────────────────────────
  {
    name:        'Krushi Arohi',
    slug:        'krushi-arohi',
    category:    'organic',
    emoji:       '🌱',
    description: 'Organic growth promoter that improves plant growth and yield. Enhances root development and nutrient uptake.',
    company:     '',
    price:       1950,
    tags:        ['growth promoter', 'fertilizer', '1 L'],
    benefits:    ['Improves plant growth', 'Enhances yield', 'Boosts nutrient uptake'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Booster Khokho',
    slug:        'booster-khokho',
    category:    'organic',
    emoji:       '💪',
    description: 'High-performance growth booster that enhances crop productivity and overall plant health.',
    company:     '',
    price:       2750,
    tags:        ['growth booster', 'fertilizer', 'productivity'],
    benefits:    ['Enhances productivity', 'Improves plant health', 'Boosts yield'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Hututu',
    slug:        'hututu',
    category:    'organic',
    emoji:       '🌻',
    description: 'Crop booster formulation that improves crop yield and strengthens plant immunity.',
    company:     '',
    price:       2750,
    tags:        ['crop booster', 'fertilizer', 'yield improvement'],
    benefits:    ['Improves crop yield', 'Strengthens immunity', 'Natural formula'],
    stock:       'In Stock',
    status:      'active',
  },

  // ── Seeds ─────────────────────────────────────────────────
  {
    name:        'Godrej 105',
    slug:        'godrej-105',
    category:    'chemical',
    emoji:       '🌽',
    description: 'High-yield hybrid maize seed by Godrej Agrovet. Suited for diverse agro-climatic conditions.',
    company:     'Godrej Agrovet',
    tags:        ['seeds', 'maize', 'hybrid', '4 kg'],
    benefits:    ['High yield', 'Hybrid variety', 'Wide adaptability'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Pioneer 3302',
    slug:        'pioneer-3302',
    category:    'chemical',
    emoji:       '🌽',
    description: 'Popular hybrid maize seed by Corteva Agriscience known for consistent performance and high yield.',
    company:     'Corteva Agriscience',
    tags:        ['seeds', 'maize', 'hybrid', '3.5 kg'],
    benefits:    ['Consistent performance', 'High yield hybrid', 'Widely adopted'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Advanta 751',
    slug:        'advanta-751',
    category:    'chemical',
    emoji:       '🌽',
    description: 'High-performance hybrid maize seed by Advanta Seeds with excellent disease resistance and yield potential.',
    company:     'Advanta Seeds',
    tags:        ['seeds', 'maize', 'hybrid', '4 kg'],
    benefits:    ['Disease resistant', 'High performance', 'Excellent yield'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'KDM 711',
    slug:        'kdm-711',
    category:    'chemical',
    emoji:       '🌾',
    description: 'Wheat seed variety suitable for local farming conditions with good grain quality and yield.',
    company:     '',
    price:       187,
    tags:        ['seeds', 'wheat', 'local variety'],
    benefits:    ['Suited for local farms', 'Good grain quality', 'Reliable yield'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Agrawal Seeds',
    slug:        'agrawal-seeds',
    category:    'chemical',
    emoji:       '🌿',
    description: 'General-purpose certified seeds by Agrawal Seeds for diverse agricultural use.',
    company:     'Agrawal Seeds',
    price:       1950,
    tags:        ['seeds', 'general purpose', '25 kg'],
    benefits:    ['General purpose use', 'Certified variety', 'Bulk availability'],
    stock:       'In Stock',
    status:      'active',
  },
  {
    name:        'Radhika',
    slug:        'radhika',
    category:    'chemical',
    emoji:       '🌸',
    description: 'Certified seed variety by Ostwal, trusted for quality and consistent germination rates.',
    company:     'Ostwal',
    price:       2600,
    tags:        ['seeds', 'certified', 'general', '25 kg'],
    benefits:    ['Certified quality', 'Consistent germination', 'Trusted brand'],
    stock:       'In Stock',
    status:      'active',
  },
];

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    let inserted = 0;
    let skipped  = 0;

    for (const p of products) {
      const exists = await Product.findOne({ slug: p.slug });
      if (exists) {
        console.log(`⚠️  Skipped (already exists): ${p.name}`);
        skipped++;
        continue;
      }
      await Product.create(p);
      console.log(`✅ Inserted: ${p.name}`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
