const {Pool} = require('pg');

const pool = new Pool({
    host: process.env.AWS_HOST,
    user: process.env.AWS_USER,
    password: process.env.AWS_PASSWORD,
    port: process.env.AWS_PORT,
    database: process.env.AWS_DB,
    ssl: {
        rejectUnauthorized: false
    },
}
    
);

module.exports = pool;