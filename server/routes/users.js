const userRoutes = require("express").Router();
const { UserController } = require("../controllers");

userRoutes.get("/getInfo", UserController.getUserInfo);
userRoutes.post("/register", UserController.register);
userRoutes.post("/login", UserController.login)
userRoutes.get("/getOneUser/:username", UserController.getOneUser)
userRoutes.put("/forgetPassword", UserController.forgetPassword)

module.exports = userRoutes