const {Schema,model}=require('mongoose');
const jwt=require('jsonwebtoken');
const userSchema= Schema({
    name:{
        type:String,
        required:true
    }}


);
userSchema.methods.generateJWT=function(){
    const token=jwt.sign({
        _id:this._id,
        number:this.number
    },process.env.JWAT_SECRET_KEY,{expiresIn:'7d'})
    return token
}
module.exports.User=model('User',userSchema);