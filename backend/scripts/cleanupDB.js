const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    console.log('🗑️ Deleting all problematic documents...');
    
    // Delete all documents to start fresh
    const deleteResult = await collection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} documents`);
    
    // Try to drop all indexes except _id_ to start fresh
    console.log('🗑️ Dropping all indexes except _id_...');
    try {
      const indexes = await collection.indexes();
      for (const index of indexes) {
        if (index.name !== '_id_') {
          try {
            await collection.dropIndex(index.name);
            console.log(`✅ Dropped index: ${index.name}`);
          } catch (err) {
            console.log(`⚠️ Could not drop index ${index.name}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.log('⚠️ Error dropping indexes:', err.message);
    }
    
    // Recreate the required indexes
    console.log('📊 Creating required indexes...');
    
    try {
      await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
      console.log('✅ Created email index');
    } catch (err) {
      console.log('⚠️ Email index error:', err.message);
    }
    
    try {
      await collection.createIndex({ username: 1 }, { unique: true, sparse: true });
      console.log('✅ Created username index');
    } catch (err) {
      console.log('⚠️ Username index error:', err.message);
    }
    
    try {
      await collection.createIndex({ 'preferences.watchlist.symbol': 1 });
      console.log('✅ Created watchlist symbol index');
    } catch (err) {
      console.log('⚠️ Watchlist index error:', err.message);
    }
    
    try {
      await collection.createIndex({ createdAt: -1 });
      console.log('✅ Created createdAt index');
    } catch (err) {
      console.log('⚠️ CreatedAt index error:', err.message);
    }
    
    console.log('🎉 Database cleanup completed successfully!');
    
    // Verify the final state
    const finalCount = await collection.countDocuments();
    const finalIndexes = await collection.indexes();
    console.log(`📊 Final document count: ${finalCount}`);
    console.log('📊 Final indexes:', finalIndexes.map(idx => idx.name));
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

cleanupDatabase();