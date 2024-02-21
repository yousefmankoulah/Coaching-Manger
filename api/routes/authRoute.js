import express from 'express';
import { signup, signin, customerSignin, signout } from '../controllers/authController.js';

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/customerSignin', customerSignin);
router.post('/signout', signout)
// router.post('/google', google)

export default router;