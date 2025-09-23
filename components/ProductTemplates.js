import React from 'react';
import './ProductTemplates.css';

// 产品模板数据
const productTemplates = [
  {
    id: 1,
    name: 'T恤',
    type: 'tshirt',
    description: '纯棉T恤，适合各种图案印刷',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 2,
    name: '马克杯',
    type: 'mug',
    description: '陶瓷马克杯，适合热饮',
    availableSizes: ['300ml', '400ml', '500ml']
  },
  {
    id: 3,
    name: '手机壳',
    type: 'phonecase',
    description: '硬壳保护套，适用于多种手机型号',
    availableSizes: ['iPhone 13', 'iPhone 14', 'Samsung S22', 'Samsung S23']
  },
  {
    id: 4,
    name: '陶瓷盘',
    type: 'ceramic',
    description: '精美陶瓷盘，适合装饰或实用',
    availableSizes: ['15cm', '20cm', '25cm']
  },
  {
    id: 5,
    name: '帆布袋',
    type: 'bag',
    description: '环保帆布袋，大容量设计',
    availableSizes: ['小号', '中号', '大号']
  },
  {
    id: 6,
    name: '笔记本',
    type: 'notebook',
    description: '精装笔记本，空白内页',
    availableSizes: ['A5', 'A4']
  }
];

function ProductTemplates({ onSelect }) {
  return (
    <div className="product-templates-container">
      <div className="product-grid">
        {productTemplates.map((product) => (
          <div
            key={product.id}
            className="product-item"
            onClick={() => onSelect(product.type)}
          >
            <div className="product-icon-container">
              <div className={`product-icon product-${product.type}`}>
                <div className="product-placeholder">{product.name}</div>
              </div>
            </div>
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <div className="product-sizes">
              <span className="size-label">规格:</span>
              <span className="size-values">{product.availableSizes.join(' / ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTemplates;