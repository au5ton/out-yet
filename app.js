const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config({ path: process.env.ENV_FILE })

const ombi = require('./lib/ombi')
const themoviedb = require('./lib/themoviedb')

const port = process.env.NODE_PORT || 3000;

var app = express();
var router = express.Router();

router.get('/', (req, res) => {
    res.json('Is it out yet?')
})

router.get('/release_dates', (req, res) => {
    themoviedb.getReleaseDates(req.query.id).then(data => {
        res.json(data);
    })
})

router.get('/requested_movies', (req, res) => {
    ombi.getMovies().then(movies => {
        res.json(movies);
    })
})

app.use(process.env.BASEURL, router);
app.listen(port, () => console.log(`Example app listening on port ${port}, baseurl: ${process.env.BASEURL}`))