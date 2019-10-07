const jwt = require('jsonwebtoken'),
    config = require('../config');

module.exports = {
    isAuthenticated: function (req, res, next) {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies.token;
        console.log(req.cookies.token, "token")
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                req.name = decoded.name;
                req.username = decoded.name;
                next();
                if (err) {
                    console.log(err, "error")
                    res.status(401).send('Unauthorized: Invalid token');
                } else {
                    req.name = decoded.name;
                    next();
                }
            });
        }
    },
    getUserData: function (req, res, next) {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies.token;
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                req.name = decoded.name;
                req.username = decoded.username;
                next();
            });
        }
    }
};
