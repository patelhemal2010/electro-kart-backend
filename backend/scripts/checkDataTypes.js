import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const checkDataTypes = async () => {
  await connectDB();

  console.log('\n=== Checking Data Types ===\n');

  const db = mongoose.connection.db;
  
  // Check categories collection
  console.log('1. Categories collection:');
  const categories = await db.collection('categories').find({}).toArray();
  categories.forEach(cat => {
    console.log(`  ${cat.name}: ${cat._id} (type: ${typeof cat._id})`);
  });

  // Check products collection
  console.log('\n2. Products collection (first 3):');
  const products = await db.collection('products').find({}).limit(3).toArray();
  products.forEach(product => {
    console.log(`  ${product.name}: category=${product.category} (type: ${typeof product.category})`);
  });

  mongoose.disconnect();
};

checkDataTypes();
