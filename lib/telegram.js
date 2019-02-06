const fetch = require('node-fetch')
require('dotenv').config({ path: process.env.ENF_FILE })
const querystring = require('querystring')
const iso = require('iso-3166-1')

const _ = {};

function pretty_message(param) {
    /*

    param:
    - title (string) title of movie
    - type (int) format of release
    - iso (string) iso_3166_1 2-char country of release

    format[1] => "Premiere", and etc
    1. Premiere
    2. Theatrical (limited)
    3. Theatrical
    4. Digital
    5. Physical
    6. TV
    */
    let format = ["n/a", "Premiere", "Theatrical (limited)", "Theatrical", "Digital", "Physical", "TV"];
    return `*${param.title}* has made a _${format[param.type]}_ release in ${iso.whereAlpha2(param.iso).country}. Check your sources.`;
}

_.sendMessage = async function(param){
    let query = querystring.encode({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: pretty_message(param),
        parse_mode: 'markdown' // See: https://core.telegram.org/bots/api#markdown-style
    })

    let json = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?${query}`).then(res => res.json())
    return json;
};

module.exports = _;