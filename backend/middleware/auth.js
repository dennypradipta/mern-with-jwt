const jwt = require('jsonwebtoken'),
    config = require('../config');

module.exports = {
    isAuthenticated: function (req, res, next) {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies.token;
    
        if (!token) {
            res.status(401).send('Unauthorized: No token provided');
        } else {
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                if (err) {
                    res.status(401).send('Unauthorized: Invalid token');
                } else {
                    req.name = decoded.name;
                    next();
                }
            });
        }  
    }
};
