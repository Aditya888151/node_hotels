const express = require('express');
const router = express.Router();
const Person = require('./../models/person');

router.post('/', async (req, res) => {
  try {
    const newPerson = new Person(req.body);
    const saved = await newPerson.save();
    console.log('Saved to restaurant.people:', saved.name);
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({error: err.message});
    } else if (err.code === 11000) {
      res.status(400).json({error: 'Email already exists'});
    } else {
      res.status(500).json({error: 'Server error'});
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (err) {
    res.status(500).json({error: 'Server error'});
  }
});

router.get('/:workType', async (req, res) =>{
    try{
      const workType = req.params.workType;
    if (workType == 'chef' || workType == 'manager' || workType == 'waiter'){
      const response = await Person.find({work: workType});
      console.log('response fetched');
      res.status(200).json(response);

    }else{
      res.status(404).json({error: 'Invalid work type'});
    }
    }catch(error){
      console.log(error);
      res.status(500).json({error: 'Internal server error'});

    }
});

router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const { name, age, work, mobile, email, salary, address } = req.body;
    const updatedPerson = { name, age, work, mobile, email, salary, address };
    const response = await Person.findByIdAndUpdate(personId, updatedPerson, {
      new: true,
      runValidators: true,
    });

    if (!response) {
      return res.status(404).json({error: 'Person not found'});
    }

    console.log('data updated');
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});

router.delete('/:id', async(req, res) =>{
  try{
    const personId = req.params.id;
    const response = await Person.findByIdAndDelete(personId);
    if(!response){
      return res.status(404).json({error: 'Person not found'});
    }
    console.log('data deleted');
    res.status(200).json({message: 'Person deleted successfully'});
  }catch(err){
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
  }
)


module.exports = router;
