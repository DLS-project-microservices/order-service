import { 
    createOrder,
    findAllOrders
     } from '../service/order.js';
import express from 'express';

const router = express.Router();

// Create an item
router.post('/', async (req, res) => {
    const newOrder = await createOrder(req.body);
    res.status(200).send(newOrder);
  });

// Get all items
router.get('/', async (req, res) => {
  const allOrders = await findAllOrders();
  console.log(allOrders);
  res.status(200).send(allOrders);
});
  
export default router;