'use script';

let handlers = {};

const notFound = (req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Route not found.');
}

/**
 * Assign a route to handle a GET request
 * @param {String} pattern - regex to search the route handler
 * @param {Function} handler - function to handle the request
 */
exports.get = (route, handler) => {
    routes = (handlers['GET'] || []);
    routes = routes.concat([{ route: route, action: handler }]);

    handlers['GET'] = routes;
}

/**
 * Handle the request
 * @param {Object} req - HTTP request instance
 * @param {Object} res - HTTP response instance
 */
exports.route = (req, res) => {
    const method = req.method;
    const url = require('url').parse(req.url);

    const handler = handlers[method].find(h => {
        return (new RegExp(`^${h.route}$`, 'i')).test(url.pathname);
    });

    if (handler){
        handler.action(req, res);
    } else {
        notFound(req, res);
    }
}