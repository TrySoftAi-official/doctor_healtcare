import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_db';

async function addDatabaseIndexes() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Appointments collection indexes
    console.log('Adding indexes to appointments collection...');
    await db.collection('appointments').createIndex({ doctorId: 1 });
    await db.collection('appointments').createIndex({ patientId: 1 });
    await db.collection('appointments').createIndex({ appointmentDate: 1 });
    await db.collection('appointments').createIndex({ status: 1 });
    await db.collection('appointments').createIndex({ type: 1 });
    await db.collection('appointments').createIndex({ 
      doctorId: 1, 
      appointmentDate: 1, 
      startTime: 1 
    });
    await db.collection('appointments').createIndex({ 
      patientId: 1, 
      appointmentDate: 1 
    });
    await db.collection('appointments').createIndex({ 
      doctorId: 1, 
      status: 1, 
      appointmentDate: 1 
    });
    
    // Messages collection indexes
    console.log('Adding indexes to messages collection...');
    await db.collection('messages').createIndex({ senderId: 1 });
    await db.collection('messages').createIndex({ receiverId: 1 });
    await db.collection('messages').createIndex({ createdAt: -1 });
    await db.collection('messages').createIndex({ 
      senderId: 1, 
      receiverId: 1, 
      createdAt: -1 
    });
    await db.collection('messages').createIndex({ 
      receiverId: 1, 
      read: 1 
    });
    
    // Notifications collection indexes
    console.log('Adding indexes to notifications collection...');
    await db.collection('notifications').createIndex({ userId: 1 });
    await db.collection('notifications').createIndex({ type: 1 });
    await db.collection('notifications').createIndex({ isRead: 1 });
    await db.collection('notifications').createIndex({ isDeleted: 1 });
    await db.collection('notifications').createIndex({ createdAt: -1 });
    await db.collection('notifications').createIndex({ 
      userId: 1, 
      isRead: 1, 
      isDeleted: 1 
    });
    await db.collection('notifications').createIndex({ 
      userId: 1, 
      createdAt: -1 
    });
    
    // Users collection indexes
    console.log('Adding indexes to users collection...');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    await db.collection('users').createIndex({ isActive: 1 });
    
    // Doctors collection indexes
    console.log('Adding indexes to doctors collection...');
    await db.collection('doctors').createIndex({ userId: 1 });
    await db.collection('doctors').createIndex({ isAvailable: 1 });
    await db.collection('doctors').createIndex({ specialization: 1 });
    
    // Patients collection indexes
    console.log('Adding indexes to patients collection...');
    await db.collection('patients').createIndex({ userId: 1 });
    
    // Prescriptions collection indexes
    console.log('Adding indexes to prescriptions collection...');
    await db.collection('prescriptions').createIndex({ patientId: 1 });
    await db.collection('prescriptions').createIndex({ doctorId: 1 });
    await db.collection('prescriptions').createIndex({ createdAt: -1 });
    await db.collection('prescriptions').createIndex({ 
      patientId: 1, 
      createdAt: -1 
    });
    
    console.log('✅ All database indexes added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding database indexes:', error);
    throw error;
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  addDatabaseIndexes()
    .then(() => {
      console.log('Database indexing completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database indexing failed:', error);
      process.exit(1);
    });
}

export { addDatabaseIndexes };
