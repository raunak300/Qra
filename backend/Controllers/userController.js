const User = require('../Model/userModel');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
        if(error.code===11000 && error.keyPattern && error.keyPattern.email){
            res.status(409).send({message:"interval server error during email bcoz of reuse of same email"});
        }
        res.status(500).send({ message: 'Internal server error in signup' });
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user =await  User.findOne({ email: email });
        if (user) {
            console.log("user email found yay from login");
            const check =await  bcrypt.compare(password, user.password);
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
                    return res.status(200).send({message:"login succesfule",data:userResponse});

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

const check=(req,res)=>{
    return res.status(200).send({isValid:true, userInfo:req.userInfo})
}

module.exports = { signUp, login, check };