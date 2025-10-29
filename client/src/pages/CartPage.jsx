import React, { useEffect, useState } from "react";
import api from "../api/api";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/getCart");
      setCart(res.data.cartItems);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const updateQty = async (id, newQty) => {
    try {
      const res = await api.put(`/cart/updateQty/${id}`, { qty: newQty });
      if (res.status === 200) fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert(error.response?.data?.message || "Error updating quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="cart-container">
      <h1 className="cart-header">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="cart-empty-message">No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img
                src={item.product.images?.[0] || "/no-image.png"}
                alt={item.product.name}
                className="cart-item-image"
              />
              <div className="item-details">
                <h2>{item.product.name}</h2>
                <p>₹{item.product.price}</p>
              </div>

              <div className="qty-controls">
                <button onClick={() => updateQty(item._id, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-summary">
            <h2 className="total-price">Total: ₹{total}</h2>
            <a href="/checkout" className="checkout-button">
              Proceed to Checkout
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
