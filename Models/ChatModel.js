import mongoose from "mongoose";

const ChatScheam = new mongoose.Schema({

    members: {
        type: Array,
    },
},
{timestamps: true,}
);

const ChatModel = mongoose.model('Chat', ChatScheam);
export default ChatModel;