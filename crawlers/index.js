const http = require('http');
const url = require('url');
const router = require('./router');
const crawler = require('./crawler');

// GET: /
router.get('/', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to IDwall crawler of Reddit!');
});

// GET: /thread
router.get('/thread', (req, res) => {
    let qs = url.parse(req.url, true).query;

    res.setHeader('Content-Type', 'application/json');

    crawler.run(qs.subreddits)
        .then(result => {
            let json = JSON.stringify(result);
            res.end(json);
        })
        .catch(reason => {
            console.log(reason);
            res.end(reason);
        });
});

const server = http.createServer(router.route);

server.listen(3000, '127.0.0.1', () => {
    const addr = server.address();
    console.log(`Server listening at http://${addr.address}:${addr.port}`);
});