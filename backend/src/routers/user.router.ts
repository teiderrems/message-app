import UserController from "@/controllers/user.controller";
import { Router } from "express";
import multer from "multer";


const userRouter: Router = Router();

userRouter.get("/", UserController.getAllUsers);
userRouter.get("/:id", UserController.getUser);
userRouter.get("/:id/friends", UserController.getUserFriends);
userRouter.get("/:id/friend-requests", UserController.getUserFriendRequests);
userRouter.get("/:id/sent-friend-requests", UserController.getUserSentFriendRequests);
userRouter.patch("/:id/accept-friend-request", UserController.acceptFriendRequest);
userRouter.patch("/:id/reject-friend-request", UserController.declineFriendRequest);
userRouter.post("/", multer().single('avatar'), UserController.createUser);
userRouter.put("/:id", UserController.updateUser);
userRouter.patch("/:id", UserController.sendFriendRequest);
userRouter.patch("/:id", multer().single('avatar'), UserController.updateUserProfile);
userRouter.patch("/:id", UserController.deleteFriend);
userRouter.patch("/:id/change-online-status", UserController.changeOnlineStatus);
userRouter.delete("/:id", UserController.deleteUser);

export default userRouter;