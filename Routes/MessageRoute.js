import express, { Router } from "express"; 
import { AddMessage, getMessages } from "../Controller/MessageController.js";

const router = express.Router();

router.post('/', AddMessage);
router.get('/:chatId', getMessages);

export default router;