import express from 'express';
import { addCustomer, getAllCustomers, getCustomer, deleteCustomer, updateCustomer } from '../controllers/coachCustomerController.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();


router.post('/addCustomer/:userId', verifyToken, addCustomer);
router.get('/getAllCustomer/:userId', verifyToken, getAllCustomers);
router.get('/getACustomer/:userId/:customerId', verifyToken, getCustomer);
router.delete('/deleteCustomer/:userId/:customerId', verifyToken, deleteCustomer);
router.put('/updateCustomer/:_id', verifyToken, updateCustomer);



export default router;