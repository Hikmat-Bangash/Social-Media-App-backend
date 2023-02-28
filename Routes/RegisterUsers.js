import express from "express";
import { login, RegisterUser } from "../Controller/AuthController.js";


const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', login)



export default router;