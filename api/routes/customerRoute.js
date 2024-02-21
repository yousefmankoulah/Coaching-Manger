import express from 'express';
import { addCustomer } from '../controllers/addCustomerController.js';

const router = express.Router();


router.post('/addCustomer/:userId', addCustomer);

export default router;