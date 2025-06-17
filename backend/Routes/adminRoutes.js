const express=require('express');
const router=express.Router()
const {trendPosts} =require('../Controllers/postController')
const {analyzeTrends}=require('../Controllers/geminiController')
const multer=require('multer');
const path=require('path');
const { checkToken } = require('../Middlewares/middleware');
const upload=multer({dest:"uploads/"})

router.get('/trends',checkToken,trendPosts);

router.post('/analyze-trends', checkToken, analyzeTrends);

module.exports=router;