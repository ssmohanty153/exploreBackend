import mongoose, { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercse: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercse: true,
        trim: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avater: {
        type: String,//cloudinary url
        required: true,

    },
    coverImage: {
        type: String,//cloudinary url
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }


    ],
    password: {
        type: String,
        required: [true, "Password is required"]

    }, refreshToken: {
        type: String,
    }

}, { timestamps: true })


//pre basically we are using to its like when any changes will
// have open it will first check the pre then move to the other opetaion
//in below its written save when data will save in data base ita will foiet go the pre which is presend in the mongoose
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }
    console.log("possward middle ware calling")
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//methods basically we are using to cretae our own merthods like isPasswordCorrect
// this in basically using in mongoose
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}
//methods basically we are using to cretae our own merthods like isPasswordCorrect
// this in basically using in mongoose
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this.id,
        email: this.email,
        username: this.username,
        fullname: this.fullname
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
//methods basically we are using to cretae our own merthods like isPasswordCorrect
// this in basically using in mongoose
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this.id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    })
}

export const User = model("User", userSchema)