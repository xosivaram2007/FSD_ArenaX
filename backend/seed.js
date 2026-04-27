const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Tournament.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'Admin'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'password123',
        role: 'Manager'
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: 'password123',
        role: 'User'
      },
      {
        name: 'Supervisor User',
        email: 'supervisor@example.com',
        password: 'password123',
        role: 'Supervisor'
      }
    ]);

    const adminUser = createdUsers[0]._id;

    await Tournament.create([
      {
        name: 'E-Sports World Cup 2026',
        sportType: 'Esports',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-06-15'),
        createdBy: adminUser
      },
      {
        name: 'Summer Basketball League',
        sportType: 'Basketball',
        startDate: new Date('2026-07-01'),
        endDate: new Date('2026-08-30'),
        createdBy: adminUser
      }
    ]);

    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
