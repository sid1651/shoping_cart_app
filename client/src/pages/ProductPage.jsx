import React, { useEffect, useState } from "react";
import api from "../api/api";




const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await api.get("/products");
      setProducts(res.data);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (id) => {
    await api.post("/cart/addToCart", { productId: id, qty: 1 });
    alert("Added to cart!");
  };

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <div className="product-image-container">
            <img
              src={product.images[0]}
              alt={product.name}
              className="product-image"
            />
          </div>
          <h2 className="product-name">{product.name}</h2>
          <p className="product-price">₹{product.price}</p>
          <button
            onClick={() => handleAddToCart(product._id)}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;