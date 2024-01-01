import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const veryfyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Autorization").replace("Bearer ", "");
        console.log(req.cookies,"req.cookies");
        if (!token) {
            throw new ApiError(401, "Unauthorizes request")
        }
        const decordToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decordToken, "decordToken");

        const user = await User.findById(decordToken._id).select("-password -refreshToken");

        console.log(user, "user");
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;

        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})