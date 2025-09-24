const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number 
  },
  work: { 
    type: String, 
    enum: ['chef', 'waiter', 'manager'], 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) { 
        return /^[\d\s\-\+\(\)]{10,15}$/.test(v); 
      },
      message: 'Mobile number must be 10-15 digits'
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  salary: { 
    type: Number, 
    required: true 
  }
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;