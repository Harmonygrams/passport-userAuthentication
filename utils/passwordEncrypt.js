const crypto = require('crypto'); 
const passwordEncrypt = (password) =>{
    const salt = crypto.randomBytes(32).toString('hex');    
    const hash = crypto.pbkdf2Sync(password,salt,10000,64,'sha512').toString('hex');
    console.log(`The value of salt is ${hash}`);
    return({salt, hash});
}
module.exports = passwordEncrypt; 
