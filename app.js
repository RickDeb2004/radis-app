const express=require('express');
const app=express();
const userRouter=require('./Router/userrouter');


app.use(express.json());
app.use('/api/user',userRouter);

module.exports=app; 
