import express from 'express';
import { addCustomerInfo, getCustomerInfo, updateCutomerInfo, addCustomerExerciesInfo, getAllCustomerExerices, getCustomerExerciesBySetExerciesId, updateCustomerExerciesInfo, deleteCustomerExercies } from '../controllers/customerInfoController.js';
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router();


router.post('/addCustomerInfo/:customerId', verifyToken, addCustomerInfo);
router.get('/getCustomerInfo/:customerId', verifyToken, getCustomerInfo);
router.put('/updateCutomerInfo/:customerId/:_id', verifyToken, updateCutomerInfo);

router.post('/addCustomerExerciesInfo/:customerId', verifyToken, addCustomerExerciesInfo);
router.get('/getAllCustomerExerices/:customerId', verifyToken, getAllCustomerExerices);
router.get('/getCustomerExerciesBySetExerciesId/:customerId/:setExerciesToCustomerId', verifyToken, getCustomerExerciesBySetExerciesId);
router.put('/updateCustomerExerciesInfo/:customerId/:_id', verifyToken, updateCustomerExerciesInfo);
router.delete('/deleteCustomerExercies/:customerId/:_id', verifyToken, deleteCustomerExercies);

export default router