const User = require('../Model/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const signUp = async (req, res) => {

    try {
        const { fullName, email, password } = req.body;
        console.log("this is data received on backend at /signup check userController:", req.body);
        const newUser = await new User({
            fullName,
            email,
            password
        })
        await newUser.save();
        try {
            const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '3h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Use secure cookies in production
                maxAge: 3 * 60 * 60 * 1000,
                sameSite: "None"
            });
            console.log("token created");

        } catch (error) {
            console.log(`error while creating token/cookie in signup: ${error}`)
        }
        const userResponse = newUser.toObject();
        delete userResponse.password;
        res.status(201).send({ message: "User SignUp Succesful", user: userResponse })
    } catch (error) {
        console.log("error in SignUp", error);
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            res.status(409).send({ message: "interval server error during email bcoz of reuse of same email" });
        }
        res.status(500).send({ message: 'Internal server error in signup' });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            console.log("user email found yay from login");
            const check = await bcrypt.compare(password, user.password);
            if (!check) {
                return res.status(401).send({ message: "user does not exist invalid credentials at login" });
            }
            else {
                try {

                    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '3h' });


                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 3 * 60 * 60 * 1000,
                        sameSite: "None"
                    });
                    console.log("token created and cookie set as well");
                    const userResponse = user.toObject();
                    delete userResponse.password;
                    return res.status(200).send({ message: "login succesfule", data: userResponse });

                } catch (error) {
                    console.log(`error while creating token/cookie in login: ${error}`);
                    return res.status(500).send({ message: 'Login successful, but failed to create session. Please try again.' });
                }
            }
        } else {
            return res.status(401).send({ message: "user does not exist invalid credentials at login" });
        }
    } catch (error) {
        console.log(`there is error in here ${error}`)
        return res.status(500).send("error in login")
    }
}

const check = (req, res) => {
    return res.status(200).send({ isValid: true, userInfo: req.userInfo })
}

const updateProfile = async (req, res) => {

    const userId = req.userInfo._id;

    const existingName=await User.findOne({_id:userId})
    if(existingName){
        return res.status(400).send({message:"you already have one can't change"});
    }
     const { userName } = req.body;
    if (!userName || userName.trim() === "") {
        return res.status(400).send({ message: "invalid userName" });
    }
    console.log("name recived at backend:", userName);
    try {
        const existingUser = await User.findOne({ userName: userName })
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            return res.status(409).send({ message: "username already exist change please" })
        }
        const updatedUser = await User.findOneAndUpdate({
            _id: userId
        }, {
            userName: userName
        }
            , { new: true, runValidators: true })
        if (!updatedUser) {
            return res.status(404).send({ message: "user not found" })
        }
        const userResponse = updatedUser.toObject();
        delete userResponse.password;
        return res.status(200).send({ message: "user updated succesfully", user: userResponse })
    } catch (error) {
        console.log("error in updating name", error);
        if (error.name === 'ValidationError') {
            return res.status(400).send({ message: error.message });
        }
        if (error.code === 11000 && error.keyPattern && error.keyPattern.userName){
            return res.status(409).send({message:"username exist,please choose different"});
        }
        return res.status(500).send({ message: "internal server error" });
    }
}
const updateImage = async (req, res) => {
    const userId = req.userInfo._id;
    try {
        if (!req.file) {
            return res.status(400).send({ message: "no file uploaded" });
        }
        console.log("file recived after multer prossing", req.file)
        const tempFilePath = req.file.path;
        const originalExtension = path.extname(req.file.originalname);
        const newFileName = `${userId}-${Date.now()}${originalExtension}`;
         const targetFilePath = path.join(__dirname, '../uploads', newFileName);
         // path.join(path.dirname(tempFilePath), newFileName);
        try {
            fs.renameSync(tempFilePath, targetFilePath);
            console.log(`File renamed successfully from ${tempFilePath} to ${targetFilePath}`);
        } catch (renameError) {
            console.error("Error during file rename:", renameError);
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            return res.status(500).json({ message: "Error saving image: failed to rename file." });
        }
        const imagePathForDb = `uploads/${newFileName}`
        const deleteFile=await User.findById(userId)
        const filetoDelete=deleteFile.userImg;
        if(filetoDelete && filetoDelete.startsWith('uploads/')){
            const oldFullFilePath = path.join(__dirname, '..', filetoDelete);
            if (fs.existsSync(oldFullFilePath)) {
                try {
                    fs.unlinkSync(oldFullFilePath); // Delete the old file
                    console.log(`Deleted old profile image: ${oldFullFilePath}`);
                } catch (unlinkError) {
                    console.warn(`Could not delete old profile image ${oldFullFilePath}:`, unlinkError);
                    // Log the warning, but don't stop the process, as the new image is saved.
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { userImg: imagePathForDb },
            { new: true, runValidators: true }
        )
        if (!updatedUser) {
            if (fs.existsSync(targetFilePath)) {
                fs.unlinkSync(targetFilePath);
            }
            return res.status(404).send({ message: "User not found or unable to update image." });
        }
        
        console.log("Updated user image path:", updatedUser.userImg);
        const userRes=updatedUser.toObject()
        delete userRes.password;
        return res.status(200).json({
        message: "Profile image updated successfully!",
        userImg: updatedUser.userImg,//frontend will show this img
        user: userRes
        });
        
        
    } catch (error) {
        console.log("error in updating the image", error);
        return res.status(500).send({ message: "internal server error in updaitng image" });

    }

}

module.exports = { signUp, login, check, updateProfile, updateImage };