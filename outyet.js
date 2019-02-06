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
    
    print_info("Loading Ombi requests.")
    let requests = await ombi.getMovies();
    print_good("Ombi requests loaded.")
    // Iterate over Ombi requests
    for(let i = 0; i < requests.length; i++) {
        print_info(`Loading release info for ${requests[i].title}`)
        let results = await themoviedb.getReleaseDates(requests[i].theMovieDbId);
        let releases = results.results;
        // Iterate over every country that has a release
        for(let j = 0; j < releases.length; j++) {
            // Iterate over every format of release in that country
            let release_dates = releases[j].release_dates
            for(let k = 0; k < release_dates.length; k++) {
                // If the format we desire is present, investigate
                // See: https://developers.themoviedb.org/3/movies/get-movie-release-dates
                if(release_dates[k].type === 4 || release_dates[k].type === 5) {
                    print_info(`${requests[i].title} has a release candidate.`)
                    // Check if the release listed in this country was released today (Only cares about day,month,year not time)
                    if(isSameDateAs(args.date, new Date(release_dates[k].release_date))) {
                        print_good("Telegram message sent!")
                        telegram.sendMessage({
                            title: requests[i].title,
                            type: release_dates[k].type,
                            iso: releases[j]['iso_3166_1'],
                            date: new Date(release_dates[k].release_date)
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