const express=require('express');
const cors = require('cors')
const app=express();
const dotenv=require('dotenv').config();
const port=process.env.PORT;
const cookieParser = require('cookie-parser'); 

app.use(cookieParser()); 

var corsOptions = {
  origin: process.env.FRONTEND_URL ,
  credentials: true 
}
app.use(cors(corsOptions))

const User=require('./Model/userModel');

app.use(express.urlencoded({extended:true}))
app.use(express.json());
const routes=require('./Routes/userRoutes');
app.use('/api', routes); 

app.listen(port,()=>{
    console.log(`listening on ${port}`);
})