const express=require('express');
const router=express.Router()
const {checkToken}=require('../Middlewares/middleware')
const {createPost, providePost}=require('../Controllers/postController')

const multer=require('multer');
const path=require('path');
const upload=multer({dest:"uploads/"})

router.post('/create',checkToken, upload.single('img'),createPost);

router.get('/all',checkToken,providePost)

module.exports=router;