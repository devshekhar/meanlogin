var express = require('express');
var router = express.Router();
var User = require('./models/userschema');
var config =require('../config/dbconfig');
var jwt = require('jsonwebtoken');
var jwtVerify =require('../routes/models/jwt_auth');
/* GET users listing. */
router.post('/login', function(req, res, next) {
  

  if(req.body.username){
    console.log('username'+req.body.username);
    console.log('password '+req.body.password)
    User.findOne({username:req.body.username},(err,user)=>{
        
      if(err){
        console.log('error is '+err);
      }
      if(user){
       var validPassword = user.comparePassword(req.body.password);
       if(!validPassword){
        res.json({
          success:false,
          message:'password incorrect',
        });
       }else{
      var token=   jwt.sign({user:user},
          config.secret)
       
       res.json({
        success:true,
        message:'Enjoy your token',
        token:token
    });
  }
     }
     if(!user){
       res.json({
         success:false,
         message:'user not found',
       });
      
    }
   });
  }
});

router.post('/signup',(req,res,next)=>{
  console.log(req.body);
  let user = new User();
  user.email = req.body.email;
  user.password= req.body.password;
  user.username = req.body.password;
  User.findOne({email:req.body.email},(err,existinguser)=>{
if(existinguser){
  res.json({
    success:false,
    message:'user already registed',
  });
}else{
  user.save();
  res.json({
    success:true,
    message:'user registed successfully',
  });
}
  })
});
router.get('/all',jwtVerify,(req,res,next)=>{
  User.find({},(err,users)=>{
    res.json({
      success:true,
      message:'get data successfully',
      data:users
    });
  })
})

module.exports = router;
