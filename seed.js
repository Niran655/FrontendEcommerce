// ✅ ដំណើរការបញ្ចូលទិន្នន័យចូល MongoDB
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Supplier from './models/Supplier.js';
import Product from './models/Product.js';
import Sale from './models/Sale.js';
import User from './models/User.js';

// ✅ អាន .env file ដើម្បីយក MongoDB URI
dotenv.config();
const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("❌ MONGODB_URI is missing from .env file");
}


const generateSeedUsers = async () => [
  {
    name: 'Admin User',
    email: 'admin@coffee.com',
    password: await bcrypt.hash('admin123', 12),
    role: 'Admin'
  },
  {
    name: 'Store Manager',
    email: 'manager@coffee.com',
    password: await bcrypt.hash('manager123', 12),
    role: 'Manager'
  },
  {
    name: 'John Cashier',
    email: 'cashier@coffee.com',
    password: await bcrypt.hash('cashier123', 12),
    role: 'Cashier'
  },
  {
    name: 'Jane StockKeeper',
    email: 'stock@coffee.com',
    password: await bcrypt.hash('stock123', 12),
    role: 'StockKeeper'
  }
];


const seedProducts = [/* your full product array here */];


const seedSuppliers = [/* your full supplier array here */];


const seedDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');


    await User.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Sale.deleteMany({});
    console.log('🧹 Cleared existing data');

  
    const seedUsers = await generateSeedUsers();
    await User.insertMany(seedUsers);
    console.log('👤 Seeded users');

  
    await Product.insertMany(seedProducts);
    console.log('📦 Seeded products');


    await Supplier.insertMany(seedSuppliers);
    console.log('🏢 Seeded suppliers');


    console.log('🎉 Database seeded successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('Admin: admin@coffee.com / admin123');
    console.log('Manager: manager@coffee.com / manager123');
    console.log('Cashier: cashier@coffee.com / cashier123');
    console.log('StockKeeper: stock@coffee.com / stock123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();