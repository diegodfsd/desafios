'use string';

const telebot = require('telebot');
const crawler = require('./crawler');


const bot = new telebot({
    token: '439971899:AAF_LaiPWFVG26GBx64C0llAbeZk0MFIzbM',
    polling: {
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000 // Optional. Reconnecting timeout (in ms).
    }
});

bot.on(/^\/nadaprafazer (.+)$/i, (msg) => {
    let subreddits = msg.text.split(' ')[1];
    crawler.run(subreddits)
        .then(result => {
            let items = parse(result);
            items.forEach(item => {
                let id = msg.from.id;
                let parseMode = 'html';

                return bot.sendMessage(
                    id, item, { parseMode }
                );
            });
        })
        .catch(reason => {
            console.log(reason);
            msg.reply.text('Ops! something went wrong, please try again.');
        });
});

/**
 * Parse to html
 * @param {Array} subreddits - subreddit detail instances
 */
const parse = (subreddits) => {
    return subreddits.map(subreddit => {
        let threads = subreddit.threads.reduce((acc, thread) => {
            return acc += ['\n', `(<i>${thread.upvotes}</i>) ${thread.subreddit} <a href="${thread.comment}">see the comments</a>`].join('');
        }, '');

        return `<b>${subreddit.title}</b>: ${threads || 'I did not find anything interesting here.'}`;
    });
}

exports.listen = () => bot.start();