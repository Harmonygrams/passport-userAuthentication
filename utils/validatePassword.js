const crypto = require('crypto'); 
const validatePassword = (password, hash, salt) =>{
    const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex'); 
    return(hash === newHash); 
};
module.exports = validatePassword;