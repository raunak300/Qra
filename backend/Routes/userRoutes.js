const express=require('express');
const router=express.Router();
const {signUp, login, check}= require('../Controllers/userController');
const {checkToken}=require('../Middlewares/middleware');

router.post('/signup',signUp);

router.post('/login',login);

router.post('/check',checkToken,check)

module.exports=router;