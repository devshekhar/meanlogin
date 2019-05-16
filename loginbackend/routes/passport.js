var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./models/userschema');
var jwt =require('jsonwebtoken');
var session = require('express-session');
var config =require('../config/dbconfig');
module.exports = function(app,passport){
     // Start Passport Configuration Settings
     app.use(passport.initialize());
     app.use(passport.session());
     app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));

     //serailize user once logged in
passport.serializeUser(function(user,done){
    //check if user has active account
    if(user.active){
       if(user.error){
           token ='unconfirmed/error';
       }else{
           token =jwt.sign({
               username:user.username,email:user.email},
               config.secret,{expiresIn:'24h'});
           }
       }else{
           token='inactive/error'
       } 
done(null,user.id);
    });

      // Deserialize Users once logged out    
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user); // Complete deserializeUser and return done
        });
    });



    // Google Strategy  
    passport.use(new GoogleStrategy({
        clientID: '515491658536-0quir8kjs4pnn71efmh9l28i6stn1pvc.apps.googleusercontent.com', // Replace with your Google Developer App client ID
        clientSecret: 'oXPWc9IBRcsBUellKUkXJzxf', // Replace with your Google Developer App client ID
        callbackURL: "http://localhost:5000/auth/google/callback" // Replace with your Google Developer App callback URL
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).select('username active password email').exec(function(err, user) {
            if (err) done(err);

            if (user && user !== null) {
                done(null, user);
            } else {
                done(err);
            }
        });
    }
));


app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
    res.redirect('/google/' + token); // Redirect user with newly assigned token
});
}
