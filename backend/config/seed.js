require('dotenv').config();
const connectDB = require('./db');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

// Categories data
const categoriesData = [
  {
    name: "String Instruments",
    slug: "string-instruments",
    description: "Classic string instruments including guitars, violins, sitars, and more",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=600&fit=crop",
    productCount: 45,
    featured: true,
  },
  {
    name: "Wind Instruments",
    slug: "wind-instruments",
    description: "Traditional and modern wind instruments - flutes, harmonium, shehnai",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop",
    productCount: 38,
    featured: true,
  },
  {
    name: "Percussion Instruments",
    slug: "percussion-instruments",
    description: "Drums, tabla, dholak, and traditional percussion instruments",
    image: "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=600&fit=crop",
    productCount: 52,
    featured: true,
  },
  {
    name: "Keyboard Instruments",
    slug: "keyboard-instruments",
    description: "Pianos, keyboards, synthesizers and electronic instruments",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop",
    productCount: 28,
    featured: false,
  },
  {
    name: "Traditional Instruments",
    slug: "traditional-instruments",
    description: "Authentic Indian classical and folk instruments",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    productCount: 35,
    featured: false,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Cases, strings, reeds, stands and essential accessories",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
    productCount: 67,
    featured: false,
  },
];

// Products data (sample from frontend)
const productsData = [
  {
    name: "Professional Acoustic Guitar",
    slug: "acoustic-guitar-001",
    description: "Premium handcrafted acoustic guitar with rich, warm tones. Perfect for beginners and professionals alike.",
    price: 12999,
    originalPrice: 15999,
    images: ["https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&h=800&fit=crop"],
    categorySlug: "string-instruments",
    stock: 25,
    featured: true,
    badge: "Bestseller",
    rating: 4.8,
    reviews: 156,
    specifications: {
      material: "Rosewood & Spruce",
      brand: "MusicPro",
      warranty: "2 Years",
      color: "Natural Wood",
    },
    tags: ["guitar", "acoustic", "string instrument"]
  },
  {
    name: "Electric Guitar Pro Series",
    slug: "electric-guitar-001",
    description: "High-performance electric guitar with premium pickups and smooth action",
    price: 24999,
    originalPrice: 29999,
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=800&fit=crop"],
    categorySlug: "string-instruments",
    stock: 15,
    badge: "New Arrival",
    rating: 4.9,
    reviews: 89,
    specifications: {
      material: "Mahogany",
      brand: "RockStar",
      warranty: "3 Years",
      color: "Sunburst",
    },
    tags: ["guitar", "electric", "string instrument"]
  },
  {
    name: "Premium Violin with Bow",
    slug: "violin-001",
    description: "Handcrafted violin made by skilled artisans. Includes bow, case, and rosin.",
    price: 18999,
    originalPrice: 22999,
    images: ["https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&h=800&fit=crop"],
    categorySlug: "string-instruments",
    stock: 20,
    featured: true,
    rating: 4.7,
    reviews: 92,
    specifications: {
      material: "Maple & Spruce",
      brand: "Maestro",
      warranty: "2 Years",
    },
    tags: ["violin", "string instrument"]
  },
  {
    name: "Handcrafted Classical Sitar",
    slug: "sitar-001",
    description: "Authentic Indian sitar made from seasoned tun wood. Rich resonance perfect for classical music.",
    price: 35999,
    originalPrice: 42999,
    images: ["https://images.unsplash.com/photo-1460036521480-ff49c08c2781?w=800&h=800&fit=crop"],
    categorySlug: "string-instruments",
    stock: 8,
    featured: true,
    badge: "Premium",
    rating: 5.0,
    reviews: 47,
    specifications: {
      material: "Tun Wood & Gourd",
      brand: "Ravi Arts",
      warranty: "2 Years",
    },
    tags: ["sitar", "traditional", "string instrument"]
  },
  {
    name: "Professional Bass Bansuri",
    slug: "bansuri-bass-001",
    description: "Deep, rich tones. Handcrafted bamboo flute perfect for Hindustani classical music.",
    price: 2499,
    originalPrice: 2999,
    images: ["https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop"],
    categorySlug: "wind-instruments",
    stock: 50,
    featured: true,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 312,
    specifications: {
      material: "Premium Bamboo",
      brand: "Bakale Music",
      warranty: "1 Year",
    },
    tags: ["bansuri", "flute", "wind instrument"]
  },
  {
    name: "Professional Harmonium 9 Scale",
    slug: "harmonium-001",
    description: "Premium quality harmonium with 9 scale changer, 3.5 octaves",
    price: 18999,
    originalPrice: 22999,
    images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&h=800&fit=crop"],
    categorySlug: "wind-instruments",
    stock: 12,
    featured: true,
    rating: 4.7,
    reviews: 134,
    specifications: {
      material: "Teak Wood",
      brand: "Bina",
      warranty: "2 Years",
    },
    tags: ["harmonium", "wind instrument"]
  },
  {
    name: "Professional Tabla Set",
    slug: "tabla-set-001",
    description: "Hand-tuned tabla set with brass bayan and wooden dayan. Includes cushions and cover.",
    price: 16999,
    originalPrice: 19999,
    images: ["https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=800&fit=crop"],
    categorySlug: "percussion-instruments",
    stock: 18,
    featured: true,
    badge: "Premium",
    rating: 4.9,
    reviews: 167,
    specifications: {
      material: "Brass & Sheesham Wood",
      brand: "Mukta Das",
      warranty: "2 Years",
    },
    tags: ["tabla", "percussion", "traditional"]
  },
  {
    name: "Traditional Dholak",
    slug: "dholak-001",
    description: "Authentic Indian dholak for folk music and celebrations",
    price: 5999,
    images: ["https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&h=800&fit=crop"],
    categorySlug: "percussion-instruments",
    stock: 30,
    rating: 4.6,
    reviews: 189,
    specifications: {
      material: "Mango Wood",
      brand: "Folk Arts",
      warranty: "1 Year",
    },
    tags: ["dholak", "percussion", "traditional"]
  },
  {
    name: "61-Key Digital Keyboard",
    slug: "keyboard-001",
    description: "Full-featured digital keyboard with 500 tones, 300 rhythms, and learning mode",
    price: 14999,
    originalPrice: 17999,
    images: ["https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop"],
    categorySlug: "keyboard-instruments",
    stock: 22,
    featured: true,
    rating: 4.6,
    reviews: 234,
    specifications: {
      brand: "Casio",
      warranty: "2 Years",
    },
    tags: ["keyboard", "digital"]
  },
  {
    name: "88-Key Digital Piano",
    slug: "digital-piano-001",
    description: "Professional weighted keys digital piano with realistic sound",
    price: 45999,
    originalPrice: 52999,
    images: ["https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=800&fit=crop"],
    categorySlug: "keyboard-instruments",
    stock: 10,
    badge: "Premium",
    rating: 4.9,
    reviews: 112,
    specifications: {
      brand: "Yamaha",
      warranty: "3 Years",
    },
    tags: ["piano", "keyboard", "digital"]
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert categories
    console.log('📦 Inserting categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`✅ ${insertedCategories.length} categories inserted`);

    // Map category slugs to IDs
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Add category IDs to products
    const productsWithCategories = productsData.map(product => ({
      ...product,
      category: categoryMap[product.categorySlug]
    }));

    // Insert products
    console.log('📦 Inserting products...');
    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ ${insertedProducts.length} products inserted`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@musicstore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9876543210',
      isVerified: true
    });
    console.log(`✅ Admin user created: ${adminUser.email}`);

    // Create test user
    console.log('👤 Creating test user...');
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      phone: '+91 9876543211',
      isVerified: true
    });
    console.log(`✅ Test user created: ${testUser.email}`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: admin@musicstore.com / admin123');
    console.log('User: user@test.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
