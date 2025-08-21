import UserController from "@/controllers/user.controller";
import { Router } from "express";
import multer from "multer";


const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:id", UserController.getUser);
userRouter.post("/", multer().single('avatar'), UserController.createUser);
userRouter.put("/:id", UserController.updateUser);
userRouter.patch("/:id", UserController.updateUserFriends);
userRouter.patch("/:id", multer().single('avatar'), UserController.updateUserProfile);
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;