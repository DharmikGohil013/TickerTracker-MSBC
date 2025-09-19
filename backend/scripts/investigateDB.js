const mongoose = require('mongoose');
require('dotenv').config();

async function investigateDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('users');
    
    // Get all indexes with details
    console.log('📋 Getting detailed index information...');
    const indexes = await collection.indexes();
    console.log('Detailed indexes:');
    indexes.forEach(idx => {
      console.log(`- ${idx.name}:`, JSON.stringify(idx, null, 2));
    });
    
    // Count documents
    const count = await collection.countDocuments();
    console.log(`📊 Total documents in users collection: ${count}`);
    
    // Get a sample document to see the structure
    if (count > 0) {
      console.log('📄 Sample document structure:');
      const sampleDoc = await collection.findOne();
      console.log(JSON.stringify(sampleDoc, null, 2));
    }
    
    // Check for documents with name field
    const docsWithName = await collection.countDocuments({ name: { $exists: true } });
    console.log(`📝 Documents with 'name' field: ${docsWithName}`);
    
    // Check for documents with null name
    const docsWithNullName = await collection.countDocuments({ name: null });
    console.log(`❌ Documents with null 'name' field: ${docsWithNullName}`);
    
  } catch (error) {
    console.error('❌ Investigation failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

investigateDatabase();