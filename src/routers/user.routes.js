import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannalProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUseCoverImage, updateUserAvtar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";
const router = Router()


router.route("/register").post(
    upload.fields([{
        name: "avater",
        maxCount: 1
    }, {
        name: "coverImage",
        maxCount: 1
    }]),
    registerUser)


router.route("/login").post(loginUser)

//secure route

router.route("/logout").post(veryfyJWT, logoutUser);


router.route("/refresh-token").post(refreshAccessToken);


router.route("/change-password").post(veryfyJWT, changeCurrentPassword);

router.route("/current-user").get(veryfyJWT, getCurrentUser);

router.route("/update-account").patch(veryfyJWT, updateAccountDetails);

router.route("/avtar").patch(veryfyJWT, upload.single("avatar"), updateUserAvtar);


router.route("/cover-image").patch(veryfyJWT, upload.single("coverImage"), updateUseCoverImage);

router.route("/c/:username").get(veryfyJWT, getUserChannalProfile);

router.route("/history").get(veryfyJWT, getWatchHistory);


export default router