var jwt = require('jsonwebtoken');
var config = require('../../config/dbconfig');
module.exports=(req,res,next)=>{
let token = req.headers['authorization'];
if(token){
    jwt.verify(token,config.secret,(err,decoded)=>{
if(err){
    res.json({
        success:false,
        message:'Failed to authenticate token',
        status:403
    });
}else{
    req.decoded = decoded;
    next();
}
    })
}else{
    
        res.status(403).json({
            status:false,
            message:'No token provided',
            status:403

            
        });
    
}
}

module.exports =function(req,res,next){
    let token = req.headers["authorization"];
    
    if(token){
   jwt.verify(token,config.secret,function(err,decoded){
          
            if(err){
                res.json({
                    success:false,
                    message:'Failed to authenticate token'
                });
            }else{
                req.decoded = decoded;
                next();
            }
        });
    }else{
        res.status(403).json({
            success:false,
            message:'No token provided'
        });
    }
}