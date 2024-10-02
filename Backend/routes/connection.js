var express = require('express');
var connectionRouter = express.Router();
const pool = require('../server/db');

connectionRouter.use(express.json());

/* GET all connections. */
connectionRouter.get('/', async(req, res) => {
  try{
    const data = await pool.query(`SELECT * FROM connected;`);
    res.status(200).json(data.rows);
  }catch(e) {
    res.status(500).send(e.message);
  }
});

//get specific connection
connectionRouter.get('/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const query = `SELECT connected.device_id, connected.sensor_id, connected.longitude, connected.latitude, device.capacity, device.last_refill, device.refills, device.created_at, device.region, sensor.created_at AS sensor_created_at FROM connected JOIN device ON connected.device_id=device.id 
    JOIN sensor ON sensor.id=connected.sensor_id WHERE connected.device_id=$1;`
    const data = await pool.query(query, [id]);
    res.status(200).json(data.rows);
  }catch(e){
    res.status(500).send(e.message);
  }
});

//connect device with sensor
connectionRouter.post('/:id', async(req, res) => {
  try{
    const {id} = req.params;
    const {sensor_id, long, lat} = req.body;
    const input = [id, sensor_id, long, lat];
    const data = await pool.query(`INSERT INTO connected VALUES($1,$2, $3, $4)`, input);
    res.status(200).json(data);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

//delete connection, used when sensor or deviec is broken and needs to be removed then form their tables
connectionRouter.delete('/:id', async(req,res) => {
  try{
    const {id} = req.params;
    const {sensor_id} = req.body;
    const input = [id, sensor_id];
    const data = await pool.query(`DELETE FROM connected WHERE device_id=$1 AND sensor_id=$2;`,input);
    res.status(200).json(data);
  }catch(e) {
    res.status(500).send(e.message);
  }
})

module.exports = connectionRouter;
