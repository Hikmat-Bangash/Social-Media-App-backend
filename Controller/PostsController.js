import PostModel from "../Models/PostSchema.js";
import UserModel from "../Models/Users.js";
import mongoose from "mongoose";

// ============ creating a post ========
export const CreatePost = async (req, res) => {
  try { 
      console.log(req.body);
    const createPost = await PostModel(req.body);
    await createPost.save();
    res.status(200).json(createPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

//=================== GET POST ==========
export const GetPost = async (req, res) => {
  const postid = req.params.id;

  try {
    const post = await PostModel.findById(postid);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
};

// =========== updating post =========

export const UpdatePost = async (req, res) => {
  const PostID = req.params.id;
  const { userID } = req.body;

  try {
    const post = await PostModel.findById(PostID);
    if (post.UserID === userID) {
      await PostModel.updateOne({ $set: req.body });
      res.status(200).json("post updated successfully");
    } else {
      res.status(403).json("You can't update other user post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// =========== DELETING A POST ===========
export const DeletePost = async (req, res) => {
  const postid = req.params.id;
  const { userID } = req.body;

  try {
    const post = await PostModel.findById(postid);
    if (post.UserID === userID) {
      await post.deleteOne();
      res.status(200).json("Post Deleted Successfully");
    } else {
      res.status(403).json("You cannot Delete Other User posts");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// ============= LIKE & DISLIKE A POST =====
export const Like_Dislike_Post = async (req, res) => {
  const postid = req.params.id;
  const { userid } = req.body;

  try {
    const post = await PostModel.findById(postid);
    if (!post.likes.includes(userid)) {
      await post.updateOne({ $push: { likes: userid } });
      res.status(200).json("Post Liked Successfully");
    } else {
      //--------- Dislike the same post ------
      await post.updateOne({ $pull: { likes: userid } });
      res.status(200).json("POST IS UNLIKED");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// ============= TIMELINE POSTS ============

// export const getTimelinePosts = async (req, res) => {
//   const userID = req.params.id;
//   try {
//     const CurrentUserPosts = await PostModel.find({ userID: userID });

//     const follwingPosts = await UserModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userID),
//         },
//       },

//       {
//         $lookup: {
//           from: "posts",
//           localField: "following",
//           foreignField: "userID",
//           as: "followingPosts",
//         },
//       },
//       {
//         $project: {
//           followingPosts: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     res.status(200).json(CurrentUserPosts.concat(...follwingPosts[0].followingPosts)
//     .sort((a,b)=>{
//         return b.createdAt - a.createdAt;
//     })
//     );
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({err: error});

//   }
// };

export const getTimelinePosts = async (req, res) => {
  const UserID = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ UserID: UserID });

    const followingPosts = await UserModel.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(UserID),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "UserID",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
