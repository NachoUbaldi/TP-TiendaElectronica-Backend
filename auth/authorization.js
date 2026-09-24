var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

// Tokens invalidated by logout, persisted to disk so they survive server restarts.
// Maps token -> expiry timestamp (ms); entries are pruned once expired.
var blacklistPath = path.join(__dirname, '..', 'data', 'token-blacklist.json');
var blacklistedTokens = {};

function loadBlacklist() {
    try {
        var stored = JSON.parse(fs.readFileSync(blacklistPath, 'utf8'));
        var now = Date.now();
        Object.keys(stored).forEach(function (token) {
            if (stored[token] > now) blacklistedTokens[token] = stored[token];
        });
    } catch (e) {
        blacklistedTokens = {}; // no file yet or corrupt: start clean
    }
}

function saveBlacklist() {
    try {
        fs.mkdirSync(path.dirname(blacklistPath), { recursive: true });
        fs.writeFileSync(blacklistPath, JSON.stringify(blacklistedTokens));
    } catch (e) {
        console.log('No se pudo persistir la blacklist de tokens:', e.message);
    }
}

loadBlacklist();

var authorization = function (req, res, next) {

    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(401).send({auth: false, message: 'No token provided.'});

    if (blacklistedTokens[token] && blacklistedTokens[token] > Date.now())
        return res.status(401).send({auth: false, message: 'Token invalidated by logout.'});

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err)
            return res.status(401).send({auth: false, message: 'Failed to authenticate token.'});
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}

// Must be applied after the authorization middleware
authorization.isAdmin = function (req, res, next) {
    if (req.userRole !== 'admin')
        return res.status(403).send({auth: false, message: 'Require Admin Role.'});
    next();
}

authorization.blacklistToken = function (token, expiresInMs) {
    if (!token) return;
    blacklistedTokens[token] = Date.now() + (expiresInMs || 86400000); // default: token lifetime (24h)
    saveBlacklist();
}

module.exports = authorization;
