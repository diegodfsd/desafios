'use strict';

const cheerio = require('cheerio');

/**
 * Parse the subreddit body
 * @param {String} html - subreddit page html
 * @return subreddit page detail
 */
exports.parse = (html) => {
    const minimum = 5000;
    const $ = cheerio.load(html);

    let title = $('.redditname a').html();
    let threads = $('div.thing', '#siteTable')
        .map(function (elem) {
            return {
                subreddit: $('a.title', $(this)).html(),
                thread: '--',
                upvotes: $('div.score.unvoted', $(this)).attr('title'),
                comment: $('a.comments', $(this)).attr('href')
            };
        })
        .get()
        .filter(function(item) {
            return item.upvotes >= minimum;
        });

    return {
        title: title,
        threads: threads
    };
};