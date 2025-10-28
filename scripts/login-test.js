// Test login as admin user
async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: '123456'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token:', data.token);
      
      // Instructions for manual browser testing
      console.log('\n📝 To test in browser, run these commands in console:');
      console.log(`localStorage.setItem('civil360_token', '${data.token}');`);
      console.log(`localStorage.setItem('civil360_user', ${JSON.stringify(data.user)});`);
      console.log("location.href = '/dashboard';");
    } else {
      console.log('❌ Login failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure your dev server is running on http://localhost:3000');
  }
}

testLogin();
