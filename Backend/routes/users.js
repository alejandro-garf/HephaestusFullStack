var express = require('express');
var userRouter = express.Router();
const pool = require('../server/db');
const verify = require('../server/verify');

userRouter.use(express.json())

//create user
userRouter.post('/', verify, async(req, res) => {
  try{
    const {first, last, email} = req.body;
    const firebase_id = req.user.uid;
    const data = [first, last, firebase_id, email];
    const user = await pool.query('INSERT INTO owner(first_name, last_name, firebase_id, email) VALUES($1, $2, $3, $4);', data);
    res.status(200).json(user);
  }catch(e){
    res.status(500).send(e.message);
  }
  
});

//get all users
userRouter.get('/', async(req, res) => {
  try{
    const data = await pool.query('SELECT * FROM owner;');
    res.status(200).json(data.rows);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

//get user
userRouter.get('/', verify, async(req, res) => {
  try{
    const firebase_id = req.user.uid; 
    const data = await pool.query('SELECT * FROM owner WHERE firebase_id=$1;', [firebase_id]);
    res.status(200).json(data.rows);
  }catch(e) {
    res.status(500).send(e.message);
  }
});

//update name
userRouter.put('/', verify, async(req, res) => {
  try{
    const firebase_id = req.user.uid;
    const {first, last} = req.body;
    const data = [first, last, firebase_id];
    const query = await pool.query('UPDATE owner SET first_name=$1, last_name=$2 WHERE firebase_id=$3;', data);
    res.status(200).json(query);
  }catch(e) {
    res.status(500).send(e.message);
  }
  
});

//update device count 
userRouter.put('/', verify, async(req, res) => {
  try{
    const firebase_id = req.user.uid;
    const query = await pool.query(`UPDATE owner SET devices_owned=devices_owned+1 WHERE firebase_id=$1`, [firebase_id]);
    res.status(200).json(query);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

//delete user
userRouter.delete('/', verify, async(req, res) => {
  try{
    const firebase_id = req.user.uid;
    const query = await pool.query('DELETE FROM owner WHERE firebase_id=$1;', [firebase_id]);
    res.status(200).json(query);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

module.exports = userRouter;
