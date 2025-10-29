import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import { useNavigate } from "react-router";

const App = () => {
  const navigate=useNavigate()
  return (
  
     <div>
     
      <nav className="navbar">
        <img src="./icon-no-bg.png" alt="Nexora Logo" className="logo" onClick={() => navigate("/")} />
        <h1>SwisCart</h1>
        <p>Seamless Shopping. Swift Delivery.</p>
        <Link to="/">Products</Link>
        <Link to="/checkout">Checkout</Link>

        <Link to="/cart">{<img src="./image-no-bg.png" alt="Cart Icon" className="cart-icon" />}</Link>
        
      </nav>
      
       <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
     </div>

     
    
  );
};

export default App;
