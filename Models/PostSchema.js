import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    UserID: {type: String,required: true},
    firstname: {type: String,required: true},
    lastname: {type: String,required: true},
    profilePic: {type: String},
    des: {type: String},
    image: {type: String},
    likes: []
},
 {timestamps: true}
)

const PostModel = mongoose.model('Posts', PostSchema);

export default PostModel;