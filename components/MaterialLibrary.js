import React from 'react';
import './MaterialLibrary.css';

// 材质数据
const materials = [
  {
    id: 1,
    name: '纯棉布料',
    type: 'cotton',
    description: '透气性好，适合T恤、帆布袋等文创产品',
    properties: { reflectivity: 10, roughness: 80 }
  },
  {
    id: 2,
    name: '丝绸',
    type: 'silk',
    description: '光滑质感，适合高端文创产品',
    properties: { reflectivity: 40, roughness: 30 }
  },
  {
    id: 3,
    name: '不锈钢',
    type: 'metal',
    description: '金属质感，适合摆件、首饰等',
    properties: { reflectivity: 80, roughness: 20 }
  },
  {
    id: 4,
    name: '陶瓷',
    type: 'ceramic',
    description: '细腻质感，适合茶具、餐具等',
    properties: { reflectivity: 30, roughness: 40 }
  },
  {
    id: 5,
    name: '木质',
    type: 'wood',
    description: '自然纹理，适合家居类文创产品',
    properties: { reflectivity: 20, roughness: 60 }
  },
  {
    id: 6,
    name: '亚克力',
    type: 'acrylic',
    description: '透明质感，适合装饰类产品',
    properties: { reflectivity: 50, roughness: 10 }
  }
];

function MaterialLibrary({ onSelect }) {
  return (
    <div className="material-library-container">
      <div className="material-grid">
        {materials.map((material) => (
          <div
            key={material.id}
            className="material-item"
            onClick={() => onSelect(material)}
          >
            <div className="material-preview">
              <div className={`material-sample material-${material.type}`}></div>
            </div>
            <h4>{material.name}</h4>
            <p className="material-description">{material.description}</p>
            <div className="material-properties">
              <div className="property-item">
                <span className="property-label">反光度:</span>
                <span className="property-value">{material.properties.reflectivity}%</span>
              </div>
              <div className="property-item">
                <span className="property-label">粗糙度:</span>
                <span className="property-value">{material.properties.roughness}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialLibrary;