import express from "express";
import { addProduct, getProducts } from "../controllers/productControllers.js";
import uplode from "../midelware/uplodeMiddelware.js";
const router = express.Router();

router.post("/products", uplode.array("images"), addProduct);
router.get("/products", getProducts);
export default router;
