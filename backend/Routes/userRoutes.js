const express=require('express');
const router=express.Router();
const {signUp, login, check, updateImage, updateProfile,profileSec}= require('../Controllers/userController');
const {checkToken}=require('../Middlewares/middleware');

const multer=require('multer');
const path=require('path');
const upload=multer({dest:"uploads/"})

router.post('/signup',signUp);

router.post('/login',login);

router.post('/check',checkToken,check)

router.post('/profile/photo',checkToken,upload.single("profile-image"),updateImage)

router.post('/profile/update',checkToken,updateProfile)

router.get('/profile',checkToken,profileSec)

module.exports=router;