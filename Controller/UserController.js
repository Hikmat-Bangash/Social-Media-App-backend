import UserModel from "../Models/Users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


// -------------- Get All Users Record ----------------
export const getAllUsers = async (req, res) =>{
  try{
      let users = await UserModel.find();
     users = users.map((user)=>{
        const {password, ...details} = user._doc;
        return details;
     })
     res.status(200).json(users);
  } catch(err){
     console.log(err);
    } 
}

// getting a single user record
export const getuser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      // when we dont want to show user password
      const { password, ...details } = user._doc;
      res.status(200).json(details);
    } else {
      res.status(404).json("This user is not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//=================== get a user and update his record ===============
export const userUpdate = async (req, res) => {
  const id = req.params.id;
  // const { _id, AdminStatus, password } = req.body;
  console.log(req.body);
  // if (id === _id) {
    try {
      //    if user want to change their password
      // if (password) {
      //   req.body.password = await bcrypt.hash(password, 10);
      // }
      const updatedRecord = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
     const user = await updatedRecord.save();

     const token = jwt.sign({
      email: user.email, id: user._id},
       process.env.JWT_KEY,
       {expiresIn: "1h"}
      )
      res.status(200).json({user, token});
    } catch (err) {
        console.log(err);
      res.status(500).json(err);
    }
  // } else {
  //   console.log("you are unable to update record!")
  //   res.status(404).json("unable to update record, wrong user");
  // }
};

// =============== DELETE USER ==========
export const DeleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};

// ============== Follow a user ============
export const FollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  if (id === _id) {
    res.status(403).json("Request Forbidden! User cannot follow themselves");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      //  checking a user whether is already followed or not
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User Followed Successfully");
      } else {
        res.status(403).json("User already Followed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
};

// ============ UNFOLLOW USER =================
export const UnfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  // ------- if the user is same or not
  if (id === _id) {
    res
      .status(403)
      .json("User Request Forbidden! user cannot unfollow themselves");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followingUser = await UserModel.findById(_id);

      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User Unfollowed Successfully");
      } else {
        res.status(403).json(" Already Unfollowed");
      }
    } catch (err) {
      res.status(403).json(err);
    }
  }
};
