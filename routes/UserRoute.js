const express = require("express")
const router = express.Router ()
const {registerUser, loginUser, getProfile, updateProfile} = require("../controllers/buyer/UserController")
const authenticateUser = require("../middlewares/authenticateUser");

router.post(
    "/register",
    registerUser
)

router.post(
    "/login",
    loginUser
)
router.get('/profile',authenticateUser, getProfile);

router.patch('/profile',authenticateUser, updateProfile )

module.exports = router