var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var userSchema = new Schema({
    username:String,
    email:String,
    password:String
});
userSchema.pre('save',function(next){
var user=this;
if(!user.isModified('password'))return next();
bcrypt.hash(user.password,null,null,(err,hash)=>{
    if(err) return next(err);
    user.password=hash;
    next();
});
});
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('User',userSchema);
