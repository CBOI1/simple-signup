const pg = require("pg");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const pool = new pg.Pool(
    {
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        database: process.env.PGDATABASE
    }
);

module.exports = { 
    saltRounds : saltRounds,
    addUser: async function (userdata) {
        const {email, first, last, password} = userdata;
        const hash = await bcrypt.hash(password, saltRounds)
        await pool.query(
            'INSERT INTO users (username, firstname, lastname, hash, membership) VALUES ($1, $2, $3, $4, $5)',
            [email, first, last, hash, false]
        );
    },
    available : async function(username) {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows.length === 0;
    },
    getUser : async function(username) {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return rows[0];
    }
}
