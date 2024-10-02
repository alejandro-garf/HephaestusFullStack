var express = require('express');
var deviceRouter = express.Router();
const pool = require('../server/db');

deviceRouter.use(express.json());

//create new device
deviceRouter.post('/new_device', async(req, res) => {
  try{
    const {long, lat, last, region } = req.body;
    const deviceData = [long, lat, last, region];
    const postQuery = `INSERT INTO device(longitude, latitude, last_refill, region) VALUES($1,$2,$3,$4);`;
    const status = await pool.query(postQuery, deviceData);
    res.status(200).json(status);
  }
  catch(e) {
    res.status(500).send(e.message);
  }
});

//get all the devices
deviceRouter.get('/all_device', async(req, res) => {
  try{
    const data = await pool.query(`SELECT * FROM device;`);
    res.json(data.rows);
  }catch(e){
    res.status(500).send(e.message);
  }
})

//get specific device
deviceRouter.get('/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const data = await pool.query(`SELECT * FROM device WHERE id=$1;`,[id]);
    res.status(200).json(data.rows);
  }catch(e){
    res.status(500).send(e.message);
  }
})

//update last_refill date
deviceRouter.put('/last_refill/:id', async(req,res) => {
  try{
    const {id} = req.params;
    const { date } = req.body;
    const data = [date, id];
    const putQuery = await pool.query(`UPDATE device SET last_refill=$1 WHERE id=$2;`,data);
    res.status(200).json(putQuery);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

//update refills count
deviceRouter.put('/refill/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const query = await pool.query(`UPDATE device SET refills=refills+1 WHERE id=$1`,[id]);
    res.status(200).json(query);
  } catch(e) {
    res.status(500).send(e.message);
  }
})

//update capacity
deviceRouter.put('/capacity/:id', async(req, res) => {
  try{
    const id = req.params.id;
    const {capacity }= req.body;
    const data = [capacity, id];
    const query = await pool.query(`UPDATE device SET capacity=$1 WHERE id=$2;`,data);
    res.status(200).json(query);
  } catch(e) {
    res.status(500).send(e.message);
  }
})

//update longitude and latitude
deviceRouter.put('/location/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const {long, lat} = req.body;
    const data = [long, lat, id]
    const query = await pool.query(`UPDATE device SET longitude=$1, latitude=$2 WHERE id=$3;`, data);
  res.status(200).json(query);
  } catch(e) {
    res.status(500).send(e.message);
  }
  
})

module.exports = deviceRouter;