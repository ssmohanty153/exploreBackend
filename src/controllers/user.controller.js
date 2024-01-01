import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {


    try {
        const user = await User.findById(userId);
        // console.log("user", user);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validatebeforeSave: false })


        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refreshand access token")
    }
}
const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, password, username } = req.body;
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // if (fullname === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const exitedUser = await User.findOne({ $or: [{ username }, { email }] })
    if (exitedUser) {
        throw new ApiError(409, "User with email or username already exits")
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avater[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;


    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avater file is required")
    }
    const avater = await uploadOnCloudnary(avatarLocalPath);

    const coverImage = await uploadOnCloudnary(coverImageLocalPath);

    if (!avater) {
        throw new ApiError(400, "Avater file is required")
    }
    try {
        const user = await User.create({
            fullname,
            avater: avater.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase()
        })
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        if (!createdUser) {
            throw new ApiError(500, "Somethings went wrong when register the user")
        }

        return res.status(201).json(

            new ApiResponse(200, createdUser, "user register successfully")
        )

    } catch (error) {
        console.error("erron in user controller ", error)
    }


    // res.status(200).json({
    //     message: "ok"
    // })

})

const loginUser = asyncHandler(async (req, res) => {
    /**
     * //req.body- data
     * username or email
     * find user
     * passsword check
     * access and refresh the token
     * send cookes
     */


    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or password is required")
    }
    const user = await User.findOne({ $or: [{ username }, { email }] })
    if (!user) {
        throw new ApiError(400, "user doesnot exit")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "invalid user creditial")

    }
    // console.log(user, "user")
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loginUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, {
        user: loginUser, accessToken, refreshToken
    }, "User login successfully"))

})

const logoutUser = asyncHandler(async (req, res) => {
    /**
     * 
     */

    await User.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User loged out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

    if (incomingRefreshToken) {
        throw new ApiError(401, "Unathorized request");

    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);


        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh request");

        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or user");

        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", newRefreshToken, options).json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "access token refreshed successfully")
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})
export { registerUser, loginUser, logoutUser, refreshAccessToken }