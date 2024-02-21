import express from 'express';
import { signup, signin, customerSignin } from '../controllers/authController.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/customerSignin', customerSignin);
// router.post('/google', google)

export default router;