import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";

// POST /api/products
export const addProduct = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, { folder: "shopping-cart" })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    // Save to MongoDB
    const newProduct = new Product({ name, price, images: imageUrls, stock });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getProducts = async (req, res) => {
    try{
const products=await Product.find()
if(!products){
    return res.status(404).json({message:"Product not found"})
}
res.status(200).json(products);
    }catch(error){
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
    }
}
