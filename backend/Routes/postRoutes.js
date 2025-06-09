const express=require('express');
const router=express.Router()
const {checkToken}=require('../Middlewares/middleware')
const {createPost}=require('../Controllers/postController')

const multer=require('multer');
const path=require('path');
const upload=multer({dest:"uploads/"})

router.post('/create',checkToken, upload.single('img'),createPost);

module.exports=router;