import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";

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

    if ([fullname, email, password, username].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All flelds are required")
    }

    const exitedUser = User.findOne({ $or: [{ username }, { email }] })
    if (exitedUser) {
        throw new ApiError(409, "User with email or username already exits")
    }
    const avatarLocalPath = req.files?.avater[0].path;

    const coverImageLocalPath = req.files?.coverImage[0]?.path;

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


    res.status(200).json({
        message: "ok"
    })

})

export { registerUser }