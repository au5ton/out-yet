const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config({ path: process.env.ENF_FILE })

const port = process.env.NODE_PORT || 3000;

var app = express();
var router = express.Router();

router.get('/', (req, res) => {
    fetch('https://api.github.com/users/github')
    .then(res => res.json())
    .then(json => {
        res.json(json)
    });
})

app.use(process.env.BASEURL, router);
app.listen(port, () => console.log(`Example app listening on port ${port}, baseurl: ${process.env.BASEURL}`))