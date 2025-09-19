const mongoose = require('mongoose');
require('dotenv').config();

async function fixDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes
    console.log('📋 Checking existing indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));
    
    // Check if name_1 index exists and drop it
    const nameIndex = indexes.find(idx => idx.name === 'name_1');
    if (nameIndex) {
      console.log('🗑️ Dropping problematic name_1 index...');
      await collection.dropIndex('name_1');
      console.log('✅ name_1 index dropped successfully');
    } else {
      console.log('ℹ️ No name_1 index found');
    }
    
    // Clean up any documents with name field
    console.log('🧹 Cleaning up documents with name field...');
    const result = await collection.updateMany(
      { name: { $exists: true } },
      { $unset: { name: "" } }
    );
    console.log(`✅ Cleaned up ${result.modifiedCount} documents`);
    
    // Ensure our required indexes exist
    console.log('📊 Ensuring correct indexes exist...');
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });
    console.log('✅ Required indexes created');
    
    console.log('🎉 Database cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

fixDatabase();