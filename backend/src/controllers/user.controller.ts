import UserService from "@/services/user.service";
import { convertFileToProfile, convertUserFriendDetailToUserFriendDetailDto, convertUserFriendOfDetailToUserFriendDetailDto } from "@/util";
import { Request, Response } from "express";

export default class UserController {

  static async createUser(req: Request, res: Response) {
    try {
      const user = await UserService.addUser({
        user: req.body,
        profil: convertFileToProfile(req)
      });
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }


  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }


  static async getUserFriends(req: Request, res: Response) {
    try {
      const friends = await UserService.getUserFriends(Number(req.params.id));
      return res.status(200).json(convertUserFriendOfDetailToUserFriendDetailDto(req.protocol!,`${req.protocol}://${req.get('host')}`, friends));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserFriendRequests(req: Request, res: Response) {
    try {
      const friendRequests = await UserService.getUserFriendRequests(Number(req.params.id));
      return res.status(200).json(convertUserFriendOfDetailToUserFriendDetailDto(req.protocol!,`${req.protocol}://${req.get('host')}`, friendRequests));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async getUserSentFriendRequests(req: Request, res: Response) {
    try {
      const sentRequests = await UserService.getFriendRequests(Number(req.params.id));
      return res.status(200).json(convertUserFriendDetailToUserFriendDetailDto(req.protocol!,`${req.protocol}://${req.get('host')}`, sentRequests));
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async changeOnlineStatus(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    try {
      const { isOnline } = req.body;
      const updated = await UserService.changeOnlineStatus({
        id: Number(id),
        isOnline,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "User online status updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const updated = await UserService.updateUser({
        id: Number(req.params.id),
        user: req.body,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async sendFriendRequest(req: Request, res: Response) {
    try {
      const updated = await UserService.sendFriendRequest({
        userId: Number(req.params.id),
        friendId: req.body.friendId,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "Friend request sent successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async acceptFriendRequest(req: Request, res: Response) {
    try {
      const updated = await UserService.acceptFriendRequest({
        userId: Number(req.params.id),
        friendId: req.body.friendId,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async declineFriendRequest(req: Request, res: Response) {
    try {
      const updated = await UserService.declineFriendRequest({
        userId: Number(req.params.id),
        friendId: req.body.friendId,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "Friend request declined successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }


  static async deleteFriend(req: Request, res: Response) {
    try {
      const updated = await UserService.removeFriend({
        userId: Number(req.params.id),
        friendId: req.body.friendId,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "Friend deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async updateUserProfile(req: Request, res: Response) {
    try {
      const updated = await UserService.updateUserProfile({
        id: Number(req.params.id),
        profile: convertFileToProfile(req)!,
      });
      if (!updated) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "User profile updated successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const deleted = await UserService.deleteUser({
        id: Number(req.params.id),
      });
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
