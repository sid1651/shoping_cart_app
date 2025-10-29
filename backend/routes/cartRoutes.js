import express from 'express';
import { addToCart, deleteCartItem,getCart,updateCartQty } from '../controllers/cartControllers.js';


const router = express.Router();

router.post('/addToCart',addToCart)
router.get("/getCart", getCart);
router.delete('/:id',deleteCartItem)
router.put('/updateQty/:id', updateCartQty);

export default router;