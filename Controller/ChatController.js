import mongoose from "mongoose";
import ChatModel from "../Models/ChatModel.js"

// ---------- creating chats of members ----------------
export const createChat = async (req, res) => {

    // console.log(req.body);

    try {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    });
      const result = await newChat.save();
      res.status(200).json(result);
    
    } catch (error) {
        res.status(500).json(error);
    }

}

// -------- find specific chat --------------------
export const Userchats = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: {$in: [req.params.userId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
}

// finding chat of two persons 
export const findChat = async (req, res) => {
    try {
        const chat = await ChatModel.find({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        console.log(chat[0]._id)
        res.status(200).json(chat[0]._id);

    } catch (error) {
        res.status(500).json(error);
    }
}