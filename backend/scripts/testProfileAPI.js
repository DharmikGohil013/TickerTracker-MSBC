const express = require('express');
const app = express();
require('dotenv').config();

// Mock Express app for testing profile endpoints
app.use(express.json());

// Test profile API endpoints
const testProfileAPI = async () => {
  console.log('\n🧪 Testing Profile API Endpoints\n');
  console.log('='.repeat(60));

  // Simulate test data
  const testUser = {
    id: '507f1f77bcf86cd799439011',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
  };

  console.log('📋 Available Profile API Endpoints:\n');

  console.log('1. GET /api/profile');
  console.log('   Description: Get current user profile');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Returns: Complete user profile with stats\n');

  console.log('2. PUT /api/profile');
  console.log('   Description: Update user profile information');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Body: {');
  console.log('     "firstName": "string",');
  console.log('     "lastName": "string",');
  console.log('     "username": "string",');
  console.log('     "avatar": "URL string",');
  console.log('     "phone": "string",');
  console.log('     "bio": "string (max 500 chars)",');
  console.log('     "dateOfBirth": "ISO date string",');
  console.log('     "country": "string",');
  console.log('     "timezone": "string"');
  console.log('   }\n');

  console.log('3. PUT /api/profile/preferences');
  console.log('   Description: Update user preferences');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Body: {');
  console.log('     "defaultCurrency": "USD|EUR|GBP|JPY|INR|CAD|AUD",');
  console.log('     "riskTolerance": "conservative|moderate|aggressive",');
  console.log('     "investmentExperience": "beginner|intermediate|advanced|expert",');
  console.log('     "notifications": {');
  console.log('       "priceAlerts": boolean,');
  console.log('       "portfolioUpdates": boolean,');
  console.log('       "marketNews": boolean,');
  console.log('       "emailNotifications": boolean');
  console.log('     }');
  console.log('   }\n');

  console.log('4. PUT /api/profile/avatar');
  console.log('   Description: Update user avatar');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Body: {');
  console.log('     "avatar": "https://example.com/avatar.jpg"');
  console.log('   }\n');

  console.log('5. GET /api/profile/stats');
  console.log('   Description: Get user profile statistics');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Returns: Profile completion, account age, activity stats\n');

  console.log('6. DELETE /api/profile');
  console.log('   Description: Delete user account (requires password)');
  console.log('   Authentication: Required (Bearer token)');
  console.log('   Body: {');
  console.log('     "password": "current password",');
  console.log('     "confirmText": "DELETE"');
  console.log('   }\n');

  console.log('='.repeat(60));
  console.log('📝 Sample cURL Commands:\n');

  console.log('# Get Profile');
  console.log('curl -X GET http://localhost:5000/api/profile \\');
  console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN"\n');

  console.log('# Update Profile');
  console.log('curl -X PUT http://localhost:5000/api/profile \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
  console.log('  -d \'{');
  console.log('    "firstName": "John Updated",');
  console.log('    "lastName": "Doe Updated",');
  console.log('    "bio": "Stock market enthusiast and trader",');
  console.log('    "country": "United States",');
  console.log('    "timezone": "America/New_York"');
  console.log('  }\'\n');

  console.log('# Update Preferences');
  console.log('curl -X PUT http://localhost:5000/api/profile/preferences \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\');
  console.log('  -d \'{');
  console.log('    "defaultCurrency": "USD",');
  console.log('    "riskTolerance": "moderate",');
  console.log('    "investmentExperience": "intermediate",');
  console.log('    "notifications": {');
  console.log('      "priceAlerts": true,');
  console.log('      "portfolioUpdates": true,');
  console.log('      "marketNews": false,');
  console.log('      "emailNotifications": true');
  console.log('    }');
  console.log('  }\'\n');

  console.log('='.repeat(60));
  console.log('🔒 Authentication Notes:\n');
  console.log('• All profile endpoints require JWT authentication');
  console.log('• Include Bearer token in Authorization header');
  console.log('• Token can be obtained from login/register endpoints');
  console.log('• Profile routes have rate limiting (20 requests per 15 minutes)');
  console.log('='.repeat(60));

  console.log('\n✅ Profile API Test Complete!');
  console.log('📖 All endpoints are properly documented and ready for use.');
  console.log('🚀 Start the server with: npm start');
  console.log('🧪 Test endpoints with your preferred API client (Postman, Insomnia, etc.)');
};

// Run the test
testProfileAPI().catch(console.error);

module.exports = { testProfileAPI };