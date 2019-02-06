const fetch = require('node-fetch')
require('dotenv').config({ path: process.env.ENV_FILE })

const _ = {};

_.getReleaseDates = async function(id){
    let json = await fetch(`https://api.themoviedb.org/3/movie/${id}/release_dates?api_key=${process.env.THEMOVIEDB_API_KEY}`).then(res => res.json())
    return json;
};

module.exports = _;