const LocalStrategy = require('passport-local').Strategy; 
const User = require('../model/User.model'); 
const validatePassword = require('../utils/validatePassword'); 
const authenticatePassport = (passport) =>{
    const customFields = {
        usernameField : 'email', 
    }
    const verifyPassword = (username, password, done) =>{
    User.findOne({email : username}).
    then(user => {
        if(!user)return(done(null, false, {message : 'Username not found'}))
        const validPassword = validatePassword(password, user.hash, user.salt); 
        if(!validPassword)return(done(null, false, {message : 'Password incorrect'})); 
        return(done(null, user)); 
    }). 
    catch(err =>{
        done(err); 
    })
    }
    passport.serializeUser((user, done) =>{
        console.log('Serializing'); 
        done(null, user.id)
    }); 
    passport.deserializeUser((id, done) =>{
        User.findById(id).
            then(user => {
                if(!user)return(done(null, false, {message : 'Invalid session'})); 
                done(null, user.id); 
            }).
            catch(err => done(err));
    });
    const strategy = new LocalStrategy(customFields, verifyPassword);
    passport.use(strategy);  
}
module.exports = {authenticatePassport};