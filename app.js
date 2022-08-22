const express = require('express'); 
const dotenv = require('dotenv').config(); 
const app = express(); 
const port = process.env.PORT;
const mongo_uri = process.env.MONGO_URI; 
const passwordEncrypt = require('./utils/passwordEncrypt');
const User = require('./model/User.model'); 
const session = require('express-session'); 
const passport = require('passport');
const {authenticatePassport} = require('./config/userAuthentication'); 
const route = express.route;
authenticatePassport(passport); 
//Internal Middleware 
app.use(express.json()); 
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret : 'outlaw',
    resave : false, 
    saveUninitialized : false, 
}));
app.use(passport.initialize());
app.use(passport.session()); 
const mongoose = require('mongoose'); 
const { type } = require('os');
app.get('/', (req, res) =>{
    console.log(req.isAuthenticated()); 
    res.send(req.isAuthenticated() ? 
        `<h3> Welcome ${req.user.name}. Click here to <a href='/logout'> Logout</a></h3>` : 
        `<h3>You're using guest account. <a href='/login'>Login</a></h3>`
    ); 
});
//User Registraton 
app.get('/register', (req, res) =>{
    res.send(`
        <form action='/register' method='POST'> 
            <div> 
                <input name='username' type='text' placeholder='Your full name'/>
                <input name='email' type='email' placeholder='email'/>
                <input name='password' type='password' placeholder='password'/>
            </div> 
            <button type='submit'> Register</button> 
        </form> 
    `);
});
app.post('/register', async (req, res) =>{
    const {username, email, password} = req.body; 
    const {salt, hash} = passwordEncrypt(password);
    try{
        const response = User({
            name : username , 
            email : email, 
            salt : salt, 
            hash : hash
        });
        response.save(); 
        res.send("<h1> You've successfuly register </h1>");
    }catch(err){
        console.log(err);
    }
});
//User login 
app.get('/login', (req, res) =>{
    if(req.isAuthenticated()){
        return res.redirect('/'); 
    }
    res.send(`
        <form action='/login' method = 'POST'>
            <div> 
                <input name='email' type='email' placeholder='email'/>
                <input name='password' type='password' placeholder='password'/>
            </div> 
            <button type='submit'> Login </button>
        </form>
    `); 
});
//User logout 
app.get('/logout', (req, res) =>{
    req.logout((err, done) =>{
        console.log('logged out');
    }); 
    res.redirect('/'); 
});
app.post('/login', passport.authenticate('local', {successRedirect : '/', failureRedirect : '/login'})); 
const connectDb = async () =>{
    try{
        await  mongoose.connect(mongo_uri);
        console.log('Database is succesfully connected'); 
    }catch(err){
        console.log(err); 
    }
}
connectDb();
app.listen(port, () =>{
    console.log(`Server is listening to port ${port}`); 
});