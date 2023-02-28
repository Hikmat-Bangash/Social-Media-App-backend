import express from "express";
import { createChat, findChat, Userchats } from "../Controller/ChatController.js";

const router = express.Router();

router.post('/create', createChat);

router.get('/:userId', Userchats);

router.get('/find/:firstId/:secondId', findChat);



export default router;