import React, { useState, useEffect } from "react";
import api from "../api/api";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [receipt, setReceipt] = useState(null);

  // Fetch cart details first
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart/getCart");
      setCart(res.data.cartItems);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!name || !email || !address) {
      alert("Please fill in all fields before placing the order.");
      return;
    }

    try {
      const res = await api.post("/checkout");
      const receiptData = {
        total,
        timestamp: new Date().toISOString(),
        items: cart.map((item) => ({
          name: item.product.name,
          qty: item.qty,
          price: item.product.price,
        })),
      };
      setReceipt(receiptData);
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  // ✅ Show message if cart is empty
  if (cart.length === 0 && !receipt) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty 🛒</h2>
        <p>Please add some products before proceeding to checkout.</p>
      </div>
    );
  }

  // ✅ Receipt View
  if (receipt) {
    return (
      <div className="receipt-container">
        <h1 className="store-name">{<img src="./icon-no-bg.png" alt="Cart Icon" className="logo" />} SwisCart</h1>
        <p className="store-tagline">Seamless Shopping • Swift Delivery</p>
        <hr className="receipt-divider" />
        <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
        <p><strong>Order ID:</strong> #{Math.floor(Math.random() * 100000)}</p>
        <p><strong>Customer:</strong> {name}</p>
        <p><strong>Address:</strong> {address}</p>

        <div className="receipt-items">
          <h3>🧾 Items Purchased</h3>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {receipt.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="receipt-divider" />
        <h2 className="total-line">Total: ₹{receipt.total}</h2>
        <p className="thanks-text"> Thank you for shopping with SwisCart!</p>
        <p className="company-info">
          SwisCart Pvt. Ltd.<br />
          221B Baker Street, Mumbai, India<br />
          GSTIN: 27AABCS1234F1Z7<br />
          Contact: support@swiscart.in
        </p>
        <p className="footer-text">This is a computer-generated invoice.</p>
      </div>
    );
  }

  // ✅ Checkout Form
  return (
    <div className="checkout-form-container">
      <h2 className="form-header">Checkout</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="form-input"
        required
      />
      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="form-input"
        required
      />
      <textarea
        placeholder="Shipping Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="form-textarea"
        required
      ></textarea>

      <button onClick={handleCheckout} className="submit-button">
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
