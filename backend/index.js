const express=require('express');
const cors = require('cors')
const app=express();
const dotenv=require('dotenv').config();
const port=process.env.PORT;
const cookieParser = require('cookie-parser'); 
const path=require("path");
app.use(cookieParser()); 

// const staticPath=path.join(__dirname,"../uploads");
// app.use(express.static(staticPath));

// const staticUploadsPath = path.join(__dirname, "../uploads"); 
// app.use('/uploads', express.static(staticUploadsPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
var corsOptions = {
  origin: process.env.FRONTEND_URL ,
  credentials: true 
}
app.use(cors(corsOptions))

const User=require('./Model/userModel');
const Post=require('./Model/postModel')

app.use(express.urlencoded({extended:true}))
app.use(express.json());
const userRoutes=require('./Routes/userRoutes');
app.use('/api', userRoutes); 
const postRoutes=require('./Routes/postRoutes')
app.use('/api/post',postRoutes);

app.listen(port,()=>{
    console.log(`listening on ${port}`);
})