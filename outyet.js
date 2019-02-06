#!/usr/bin/env node
const chalk = require('chalk');
const ombi = require('./lib/ombi');
const themoviedb = require('./lib/themoviedb');
const telegram = require('./lib/telegram');
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'OutYet'
});
parser.addArgument(
    [ '-d', '--date' ],
    {
        action: 'store',
        defaultValue: '-1',
        type: 'string',
        help: 'Pretend this is the current date'
    }
);
var args = parser.parseArgs();

const GOOD = `[${chalk.green("✓")}] `
const WARN = `[${chalk.red("✗")}] `
const INFO = "[i] "

function print_good() {
    process.stdout.write(GOOD);
    console.log.apply(this, arguments);
}
function print_warn() {
    process.stdout.write(WARN);
    console.log.apply(this, arguments);
}
function print_info() {
    process.stdout.write(INFO);
    console.log.apply(this, arguments);
}

// See: https://stackoverflow.com/a/4428396
function isSameDateAs(d, pDate) {
    return (
        d.getFullYear() === pDate.getFullYear() &&
        d.getMonth() === pDate.getMonth() &&
        d.getDate() === pDate.getDate()
    );
}

(async function(){
    if(args.date !== "-1") {
        if(isNaN(new Date(args.date))) {
            print_warn("Substituted date was invalid, the current date will be used")
            args.date = "-1"
        }
        else {
            print_good("Substitute date was good.")
            args.date = new Date(args.date)
        }
    }
    if(args.date === "-1") {
        args.date = new Date()
    }
    
    let request_ids = [];
    let request_titles = [];
    print_info("Loading Ombi requests.")
    let movies = await ombi.getMovies();
    print_good("Ombi requests loaded.")
    for(let elem of movies) {
        request_ids.push(elem.theMovieDbId)
        request_titles.push(elem.title)
    }
    for(let i = 0; i < movies.length; i++) {
        print_info(`Loading release info for ${movies[i].title}`)
        let releases = await themoviedb.getReleaseDates(movies[i].theMovieDbId);
        print_info(`${movies[i].title} releases loaded.`)
        let results = releases.results;
        for(let j = 0; j < results.length; j++) {
            for(let k = 0; k < results[j].release_dates[k].length; k++) {
                let a_release = results[j].release_dates[k]
                // See: https://developers.themoviedb.org/3/movies/get-movie-release-dates
                if(a_release.type === 4 || a_release.type === 5) {
                    // If this date is older than today
                    print_info(`${movies[i]} has a release match`)
                    if(isSameDateAs(args.date, new Date(a_release.release_date))) {
                        print_good("Telegram message sent!")
                        telegram.sendMessage({
                            title: movies[i].title,
                            type: a_release.type,
                            iso: results[j]['iso_3166_1']
                        })
                    }
                }
            }
        }
    }
})();

/*

if args date is valid
    set current date to that date
else
    set current date to current date



if current date == release date
    send message


*/