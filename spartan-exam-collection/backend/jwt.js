const jwt = require('jsonwebtoken');
const secretKey = "mysecretkeyisunique";
const defaultOptions = {
    algorithm: 'HS256',
    noTimestamp: false,
    expiresIn: '30d'
};
let service = {};
var Profile = require('./models/profile');
service.generate = (payload, signOptions) => {
    payload.created_at = new Date().getTime()
    return jwt.sign(payload || {}, secretKey, Object.assign({}, defaultOptions, signOptions));
};
service.validate = (token) => {
    return new Promise(function(resolve, reject) {
        try {
            let result = jwt.verify(token, secretKey);
            resolve(result);
        } catch (e) {
            reject({
                result : 'failure',
                message : 'Signin Error'
            });
        }
    });
};
service.verifyRequest = (req, res, next) => {
    let token = (req.headers['authorization'] || "").split('Bearer ')[1] || req.query.token || "";
    service.validate(token).then((payload) => {
        req.session = payload;
        return Profile.findOne({
            userId : payload.userId
        })
    }).then((dbObj) => {
        if (!!dbObj) {
            next();
        } else {
            throw {
                result : 'failure',
                message : 'Signin Error'
            };
        }
    }).catch(e => res.json({
        result : 'failure',
        message : "Login First"
    }));
};
module.exports = service;
