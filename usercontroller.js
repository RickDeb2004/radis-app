const bcrypt=require('bcrypt');
const _ =require('lodash');
const axios=require('axios');
const otpGenerator=require('otp-generator');
const {User}=require('../Model/usermodel');
const {Otp}=require('../Model/otpmodel');
const { response } = require('../app');
module.exports.signUp=async (req,res)=>{
const user=await User.findOne({
    number:req.body.number
});
  if (user) return res.status(400).send("already exist");
  const OTP=otpGenerator.generate(6,{
    digits:true,alphabet:false,upperCaseAlphabets:false,specialChars:false
  });
  const number=req.body.number;
  

   const fast2sms=new URLSearchParams();
   fast2sms.append('token','sDcSnUYQ3j0rbCwE1Az4LZMfRdX8OxTqe52Fti9Ky7GgWNk6haICSGstWFu3irM6gByq2E8hUeQw09mT');
   fast2sms.append('to',`+${number}`);
   fast2sms.append('message',`verification code ${OTP}`);
   axios.post('https://www.fast2sms.com/dev/bulkV2',fast2sms).then(response =>{console.log(response.data);});
  const otp=new OTP({
    number:number,otp:OTP
  });
  const salt=await bcrypt.genSalt(10)
  otp.otp=await bcrypt.hash(otp.otp)
  const result=await otp.save();
  return res.status(200).send('OTP SENT SUCCESSFULLY')

}
module.exports.verifyOtp=async (req,res)=>{
    const otpHolder=await Otp.find({
        number:req.body.number
    });
  if(otpHolder.length===0) return res.status(400).send('YOU USE EXPIRED OTP')
    const rightOtpFind=otpHolder[otpHolder.length-1];
    const validUser=await bcrypt.compare(req.body.otp,rightOtpFind.otp);
    if(rightOtpFind.number===req.body.number && validUser)
    {
        const user=new User(_.pick(req.body,['number']));
        const token=user.generateJWT();
        const result=await user.save();
        const otpDelete=await Otp.deleteMany({
            number:rightOtpFind.number
        });
    }
    else
        {return res.status(400).send('OTP WAS WRONG')}
}
