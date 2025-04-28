const mongoose = require('mongoose');
const Class = require('../database/Class');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const classes = [
  { name: 'Class C1' },
  { name: 'Class C2' },
  { name: 'Class C3' },
  { name: 'Class C4' },
];

const seedClasses = async () => {
  try {
    await Class.deleteMany({});
    await Class.insertMany(classes);
    console.log('Classes seeded successfully');
  } catch (error) {
    console.error('Error seeding classes:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedClasses();