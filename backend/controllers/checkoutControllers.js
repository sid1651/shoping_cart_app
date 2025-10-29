import cartModel from "../models/cartModel.js";
import Product from "../models/product.js";

export const checkout = async (req, res) => {
  try {
    // ✅ Fetch all items from the cart in database
    const cartItems = await cartModel.find().populate("productId");

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ✅ Calculate total and update stock
    let total = 0;
    for (const item of cartItems) {
      const product = item.productId;
      if (!product) continue;

      // Add product price × qty to total
      total += product.price * item.qty;

      // Optional: decrease stock
      if (product.stock >= item.qty) {
        product.stock -= item.qty;
        await product.save();
      } else {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }
    }

    // ✅ Create a mock receipt
    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items: cartItems.map(item => ({
        name: item.productId.name,
        qty: item.qty,
        price: item.productId.price,
      })),
    };

    // ✅ Clear cart after checkout
    await cartModel.deleteMany();

    res.status(200).json({
      message: "Checkout successful",
      receipt,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
