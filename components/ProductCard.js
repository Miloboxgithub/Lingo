import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, showPrice = false }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = '/images/placeholder.png';
            e.target.alt = '产品图片占位符';
          }}
        />
        {product.hasCopyright && (
          <div className="copyright-badge">已版权保护</div>
        )}
        {product.isForSale && showPrice && (
          <div className="price-tag">¥{product.price}</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-creator">
          <Link to={`/creator/${product.creator}`}>@{product.creator}</Link>
        </p>
        <div className="product-meta">
          <span className="product-likes">{product.likes} 喜欢</span>
          {product.isForSale && (
            <span className="product-sale-status">可交易</span>
          )}
        </div>
      </div>
      <div className="product-actions">
        {product.isForSale && showPrice ? (
          <Link to={`/product/${product.id}/purchase`} className="buy-button">
            购买版权
          </Link>
        ) : (
          <button className="like-button">喜欢</button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;