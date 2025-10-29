import cartModel from "../models/cartModel.js";
import Product from "../models/product.js";
export const addToCart = async (req, res) => {
  try {
    console.log("✅ Incoming request to /api/cart");
    console.log("📦 Received body:", req.body);

    const { productId, qty } = req.body;

    if (!productId || !qty) {
      console.log("❌ Missing productId or qty");
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }

    console.log("🔍 Searching for product with ID:", productId);
    const product = await Product.findById(productId);

    if (!product) {
      console.log("❌ Product not found for ID:", productId);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("✅ Product found:", product.name, " | Stock:", product.stock);

    if (qty > product.stock) {
      console.log("⚠️ Requested qty exceeds stock:", qty, ">", product.stock);
      return res.status(400).json({ message: "Not enough stock available" });
    }

    console.log("🛒 Creating cart item...");
    const cartItem = new cartModel({ productId, qty });

    console.log("💾 Saving cart item to database...");
    await cartItem.save();

    console.log("✅ Cart item saved successfully:", cartItem);
    res.status(201).json({ message: "Product added to cart", cartItem });

  } catch (error) {
    console.error("💥 Error adding product to cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCartQty = async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;

    const cartItem = await cartModel.findById(id).populate("productId");

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const product = cartItem.productId;

    // check stock
    if (qty > product.stock) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // prevent negative qty
    if (qty < 1) {
      await cartModel.findByIdAndDelete(id);
      return res.status(200).json({ message: "Item removed from cart" });
    }

    cartItem.qty = qty;
    await cartItem.save();

    res.status(200).json({ message: "Quantity updated", cartItem });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteCartItem=async(req,res)=>{
    try{
const {id}=req.params;
const deletedItem=await cartModel.findByIdAndDelete(id);
if(!deletedItem){
    return res.status(404).json({message:"Cart item not found"});
}
res.status(200).json({message:"Cart item deleted successfully"});
    }catch(error){
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: error.message });
    }
}



export const getCart = async (req, res) => {
  try {
    // Fetch all cart items and populate product details
    const cartItems = await cartModel.find().populate("productId");

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cartItems: [], total: 0 });
    }

    // Calculate total price
    const total = cartItems.reduce((acc, item) => {
      const productPrice = item.productId?.price || 0;
      return acc + productPrice * item.qty;
    }, 0);

    // Format response (to avoid showing internal Mongo details)
    const formattedCart = cartItems.map(item => ({
      _id: item._id,
      product: {
        name: item.productId.name,
        price: item.productId.price,
        images: item.productId.images,
      },
      qty: item.qty,
    }));

    res.status(200).json({ cartItems: formattedCart, total });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
