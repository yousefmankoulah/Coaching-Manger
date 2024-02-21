import express from 'express';
import { addCustomer, getAllCustomers } from '../controllers/coachCustomerController.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();


router.post('/addCustomer/:userId', verifyToken, addCustomer);
router.get('/getAllCustomer/:userId', verifyToken, getAllCustomers);

export default router;