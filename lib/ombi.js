const fetch = require('node-fetch')
require('dotenv').config({ path: process.env.ENF_FILE })

const _ = {};

_.getMovies = async function(){
    let json = await fetch(`${process.env.OMBI_SERVER_HOST}/api/v1/Request/movie?apikey=${process.env.OMBI_API_KEY}`).then(res => res.json())
    return json;
};

module.exports = _;