const mongoose = require('mongoose');
const db = process.env.DB_URL;
const bcrypt = require('bcrypt');


mongoose.connect(db).
    then(() => {
        console.log("connected to db")
    }).catch((err) => {
        console.log("MONGODB connection error:", err);
    })
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userName: {
    type: String,
    required: false,
    unique: true,
    sparse: true,      // Unique only for docs where userName exists and is not null
    default: null,
  },
    userImg: {
        type: String,
        default:null
    },
    uploadedImages: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

userSchema.pre('save', async function(next) {
    try {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (err) {
        console.log(`This is an error on hashing password: ${err}`);
        next(err); // Pass the error to the next middleware
    }
});
const User=mongoose.model('User',userSchema);


module.exports= User;