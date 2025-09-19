const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegistration() {
  try {
    console.log('🧪 Testing registration API...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test@example.com',
        password: 'TestPass123',
        firstName: 'Test',
        lastName: 'User'
      })
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.text();
    console.log('📄 Response body:', data);
    
    if (response.ok) {
      console.log('✅ Registration API test PASSED!');
    } else {
      console.log('❌ Registration API test FAILED!');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testRegistration();