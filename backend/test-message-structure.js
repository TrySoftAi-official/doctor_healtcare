// Test script to check message data structure
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas (simplified)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  role: String,
});

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  subject: String,
  isRead: Boolean,
  createdAt: Date,
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

async function testMessageStructure() {
  try {
    console.log('Testing message data structure...');
    
    // Get a sample message with populated data
    const message = await Message.findOne()
      .populate('senderId', 'firstName lastName email role')
      .populate('recipientId', 'firstName lastName email role')
      .exec();
    
    if (message) {
      console.log('Sample message structure:');
      console.log(JSON.stringify(message, null, 2));
      
      console.log('\nSender data:');
      console.log('Type:', typeof message.senderId);
      console.log('Data:', message.senderId);
      
      console.log('\nRecipient data:');
      console.log('Type:', typeof message.recipientId);
      console.log('Data:', message.recipientId);
    } else {
      console.log('No messages found in database');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

testMessageStructure();
