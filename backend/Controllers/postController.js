const User = require('../Model/userModel');
const path = require('path');
const fs = require('fs')
const Post = require('../Model/postModel');
const { userInfo } = require('os');

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



// const providePost = async (req, res) => {
//     const userId = req.userInfo.id;
//     if (!userId) {
//         return res.stauts(400).send({ message: "User id is req to send post" })

//     }
//     try {
//         //sending all post of all users
//         console.log("sending all post of all users")
//         const posts = await Post.find({ likedBy: { $ne: userId }}).sort({ createdAt: -1 })
//         if (posts.length === 0) {
//             return res.status(200).json({ message: "no post found", posts: [] })
//         }
//         return res.status(200).json({ message: "Check these post", posts: posts })
//     } catch (error) {
//         console.error("Error fetching posts:", error);
//         return res.status(500).json({ message: "Internal server error fetching posts." });
//     }
// }

const providePost = async (req, res) => {
    const userId = req.userInfo.id;
    if (!userId) {
        return res.status(400).send({ message: "User id is required to send post" });
    }

    try {
        // Find user with likedPosts
        const user = await User.findById(userId);
        const likedPostIds = user.likedPosts || [];

        // Send only posts that user hasn't liked yet
        const posts = await Post.find({ _id: { $nin: likedPostIds } }).sort({ createdAt: -1 });

        return res.status(200).json({ message: "Filtered posts", posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return res.status(500).json({ message: "Internal server error fetching posts." });
    }
};



const likeHandel = async (req, res) => {
    const id = req.userInfo.id;
    const photoLiked = req.params.postid;

    try {
        const user = await User.findById(id);
        const post = await Post.findById(photoLiked);

        if (!user || !post) {
            return res.status(404).json({ message: "User or Post not found" });
        }

        // Initialize arrays if they don't exist
        if (!user.likedPosts) user.likedPosts = [];
        if (!post.LikedBy) post.LikedBy = [];
        if (!post.Likes) post.Likes = 0;

        // Check if already liked
        const alreadyLiked = user.likedPosts.includes(photoLiked) || post.LikedBy.includes(id);
        if (alreadyLiked) {
            return res.status(400).json({ message: "You have already liked this post." });
        }

        // Update
        user.likedPosts.push(photoLiked);
        post.LikedBy.push(id);
        post.Likes += 1;

        await user.save();
        await post.save();

        return res.status(200).json({ message: "Post liked successfully!" });

    } catch (error) {
        console.error("Error in liking a post:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const trendPosts = async (req, res) => {
    try {
        // Optional: filter trending posts by minimum likes
        const MIN_LIKES = 1;

        const posts = await Post.find({ Likes: { $gte: MIN_LIKES } })
            .sort({ Likes: -1, createdAt: -1 })
            .limit(10);

        res.status(200).json({
            message: "Trending posts fetched successfully",
            posts
        });
    } catch (error) {
        console.error("Error fetching trending posts:", error);
        res.status(500).json({
            message: "Failed to fetch trending posts",
            error: error.message
        });
    }
};


module.exports = { createPost, providePost,likeHandel,trendPosts };