import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
dotenv.config();

const app = express();
connectCloudinary();
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
connectDB(); 
const PORT = process.env.PORT || 5000;

app.use("/api/cart", cartRoutes);

app.use("/api", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
