// Test the API endpoint directly
async function testAPI() {
  try {
    console.log('Testing /api/products endpoint...');
    const response = await fetch('http://localhost:3000/api/products');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response successful!');
      console.log('Status:', response.status);
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.log('❌ API Error:', response.status);
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Failed to call API:', error.message);
  }
}

testAPI();