// Simple test script to verify messages endpoint
const axios = require('axios');

async function testMessages() {
  try {
    console.log('Testing messages endpoint...');
    
    // Test without authentication first
    const response = await axios.get('http://localhost:3000/messages/my-messages');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Expected error (no auth):', error.response?.status, error.response?.data);
  }
  
  try {
    // Test with a dummy token
    const response = await axios.get('http://localhost:3000/messages/my-messages', {
      headers: {
        'Authorization': 'Bearer dummy-token'
      }
    });
    console.log('Response with dummy token:', response.data);
  } catch (error) {
    console.log('Error with dummy token:', error.response?.status, error.response?.data);
  }
}

testMessages();
