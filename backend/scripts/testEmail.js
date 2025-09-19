const emailService = require('../utils/emailService');
require('dotenv').config();

async function testEmailService() {
  console.log('🧪 Testing Email Service...');
  
  // Test connection
  console.log('📧 Testing email connection...');
  const connectionResult = await emailService.testConnection();
  
  if (connectionResult) {
    console.log('✅ Email connection successful!');
    
    // Test OTP generation
    const otp = emailService.generateOTP();
    console.log(`📱 Generated OTP: ${otp}`);
    
    // Test sending OTP email (optional - uncomment to actually send)
    // const testEmail = 'test@example.com';
    // const emailResult = await emailService.sendOTPEmail(testEmail, otp, 'Test User');
    // console.log('📧 Email send result:', emailResult);
    
  } else {
    console.log('❌ Email connection failed!');
    console.log('Please check your .env file email configuration:');
    console.log('- EMAIL_SERVICE (gmail)');
    console.log('- EMAIL_USERNAME (your email)');
    console.log('- EMAIL_PASSWORD (app password)');
    console.log('- EMAIL_FROM (sender email)');
  }
}

testEmailService();