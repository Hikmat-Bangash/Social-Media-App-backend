import express from "express";
import { DeleteUser, FollowUser, getAllUsers, getuser, UnfollowUser, userUpdate } from "../Controller/UserController.js";

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getuser);              // getting user record
router.put('/update/:id', userUpdate);    // updating user record
router.delete('/:id', DeleteUser);        // deleting user
router.put('/:id/follow', FollowUser);    // Follow a user
router.put('/:id/unfollow', UnfollowUser);// Unfollow a user 

export default router;