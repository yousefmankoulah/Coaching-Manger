import express from 'express';
import { signup, signin, customerSignin, signout, updateUser } from '../controllers/authController.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/customerSignin', customerSignin);
router.post('/signout', signout)
router.put('/updateUser/:_id', verifyToken, updateUser)
// router.post('/google', google)

export default router;