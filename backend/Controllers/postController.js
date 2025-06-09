const User =require( '../Model/userModel');
const path = require('path');
const fs = require('fs')
const Post = require('../Model/postModel')

const createPost = async(req, res) => {
    const userid = req.userInfo.id;
    const { title, textContent } = req.body;
    const img = req.file;

    if (!title || !textContent || !img) {
        return res.status(400).send({ message: "img, title and content are required for post creation" });
    }
    try {
        const user =await User.findById(userid);
        if (!user) {
            return res.status(404).send({ messag: "user does not exist" })
        }
        const tempPath = img.path;
        const originalExtension = path.extname(req.file.originalname);
        const newFileName = `${userid}-${Date.now()}${originalExtension}`;
        const targetFilePath = path.join(__dirname, '../uploads', newFileName);
        try {
            fs.renameSync(tempPath, targetFilePath);
            console.log(`File renamed successfully from ${tempPath} to ${targetFilePath}`);
        } catch (renameError) {
            console.error("Error during file rename:", renameError);
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            return res.status(500).json({ message: "Error saving image: failed to rename file." });
        }
        const newPost =await new Post({
            userId: userid,
            userName:user.userName,
            email: user.email,
            title: title,
            textContent: textContent,
            imagePath: `uploads/${newFileName}`
        })
        const savedPost=await newPost.save();
        console.log("post saved succesfully",savedPost)
        return res.status(201).send({message:"Post saved succesfully",post:savedPost})

    } catch (error) {
        console.log("Error in creating a Post",error)
        return res.status(500).send({message:"Internal server error while posting"})
    }
}

module.exports = {createPost};