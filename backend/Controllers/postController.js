const User = require('../Model/userModel');
const path = require('path');
const fs = require('fs')
const Post = require('../Model/postModel')

const createPost = async (req, res) => {
    const userid = req.userInfo.id;
    const { title, textContent } = req.body;
    const img = req.file;

    if (!title || !textContent || !img) {
        return res.status(400).send({ message: "img, title and content are required for post creation" });
    }
    try {
        const user = await User.findById(userid);
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
        const newPost = await new Post({
            userId: userid,
            userName: user.userName,
            email: user.email,
            title: title,
            textContent: textContent,
            imagePath: `uploads/${newFileName}`
        })
        const savedPost = await newPost.save();
        console.log("post saved succesfully", savedPost)
        user.uploadedPosts.push({
            postId: savedPost._id, // Store the _id of the saved post
            title: savedPost.title,
            imagePath: savedPost.imagePath,
            textContent: savedPost.textContent
        });
        await user.save();
        return res.status(201).send({ message: "Post saved succesfully", post: savedPost })

    } catch (error) {
        console.log("Error in creating a Post", error)
        return res.status(500).send({ message: "Internal server error while posting" })
    }
}



const providePost = async (req, res) => {
    const userId = req.userInfo.id;
    if (!userId) {
        return res.stauts(400).send({ message: "User id is req to send post" })

    }
    try {
        //sending all post of all users
        console.log("sending all post of all users")
        const posts = await Post.find({}).sort({ createdAt: -1 })
        if (posts.length === 0) {
            return res.status(200).json({ message: "no post found", posts: [] })
        }
        return res.status(200).json({ message: "Check these post", posts: posts })
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error fetching posts." });
    }
}

module.exports = { createPost, providePost };