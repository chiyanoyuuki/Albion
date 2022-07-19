const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "chiyanoyuuki1512.",
    database: "albion"
});

const express = require('express');
const app = express(),
    bodyParser = require("body-parser");
port = 3080;
app.use(bodyParser.json());

con.connect();

app.get('/api/personnages', (req, res) => {
    con.query("SELECT * FROM personnages", function (err, result, fields) {
        res.json(result);
      });
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

