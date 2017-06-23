'use strict';

const url = require('url');
const http = require('https');
const parser = require('./parser');


/**
 * Make a request
 * @param {String} path - subreddit name
 * @param {Function} done - function to handle the response
 */
function request(path, done) {
    const options = {
        host: 'www.reddit.com',
        path: path,
        agent: false,
        headers: { 'user-agent': 'IDwall crawler' }
    };

    http.get(options, (res) => callback(res, done));
}

/**
 * Handler response
 * @param {Object} response - http response
 * @param {Function} done - function to handle the response
 */
function callback(response, done) {
    let statusCode = response.statusCode;
    let location = response.headers.location;

    if (statusCode === 301 && location) {
        return request(url.parse(location).path, done);
    } else {
        let body = '';

        response.setEncoding('UTF-8');
        response.on('data', function data(chunk) {
            body += chunk;
        });

        response.on('end', function end() {
            return done(null, parser.parse(body));
        });

        response.on('error', function error(reason) {
            return done(reason);
        });
    }
}

/**
 * Get the content body of a subreddit
 * @param {Array} subreddits - sub reddit name
 * @return parsed data from reddit
 */
exports.run = (subreddits) => {
    let threads = subreddits.split(';');
    let results = threads
        .map((subreddit) => (new Promise((resolve, reject) => { 
            request(`/r/${subreddit}/top/`, (err, result) => {
                if (err) {
                    return reject(err);
                }

                return resolve(result);
            });
        })));

    return Promise.all(results);
}