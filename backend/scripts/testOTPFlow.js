const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testOTPFlow() {
  const baseURL = 'http://localhost:5000/api/auth';
  
  console.log('🧪 Starting OTP Registration Flow Test\n');

  // Test data
  const testUser = {
    username: 'testuser' + Date.now(),
    email: 'test' + Date.now() + '@example.com',
    password: 'TestPass123',
    firstName: 'Test',
    lastName: 'User'
  };

  try {
    // Step 1: Register user
    console.log('📝 Step 1: Registering user...');
    const registerResponse = await fetch(`${baseURL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    console.log('📊 Registration Response:', JSON.stringify(registerData, null, 2));

    if (!registerResponse.ok) {
      throw new Error(`Registration failed: ${registerData.message}`);
    }

    console.log('✅ Registration successful!\n');

    // Extract OTP from response (development mode)
    let otp = registerData.data?.developmentOTP;
    if (!otp) {
      console.log('❓ No OTP in response. Check server console for OTP.');
      otp = prompt('Please enter the OTP from server console:');
    }

    // Step 2: Verify OTP
    console.log('🔐 Step 2: Verifying OTP...');
    const verifyResponse = await fetch(`${baseURL}/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        otp: otp
      })
    });

    const verifyData = await verifyResponse.json();
    console.log('📊 Verification Response:', JSON.stringify(verifyData, null, 2));

    if (!verifyResponse.ok) {
      throw new Error(`Verification failed: ${verifyData.message}`);
    }

    console.log('✅ Email verification successful!');
    console.log('🎉 Complete registration flow test PASSED!\n');

    // Optional: Test resend OTP
    console.log('🔄 Testing resend OTP functionality...');
    const resendResponse = await fetch(`${baseURL}/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email })
    });

    const resendData = await resendResponse.json();
    console.log('📊 Resend Response:', JSON.stringify(resendData, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch('http://localhost:5000/health');
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('Run: npm run dev\n');
    return false;
  }
}

async function main() {
  if (await checkServer()) {
    await testOTPFlow();
  }
}

main();
