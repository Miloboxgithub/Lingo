import React from 'react';
import { Link } from 'react-router-dom';
import './SupplyChain.css';

function SupplyChain() {
  return (
    <div className="supply-chain-page">
      <div className="supply-chain-container">
        <h2>供应链管理</h2>
        <div className="supply-chain-content">
          <div className="supply-section">
            <h3>供应商管理</h3>
            <p>管理您的供应商信息和合作关系</p>
            <div className="supply-actions">
              <button className="btn btn-primary">添加供应商</button>
              <button className="btn btn-secondary">查看供应商列表</button>
            </div>
          </div>
          
          <div className="supply-section">
            <h3>材料管理</h3>
            <p>管理设计所需的各类材料信息</p>
            <div className="supply-actions">
              <button className="btn btn-primary">添加材料</button>
              <button className="btn btn-secondary">查看材料库</button>
            </div>
          </div>
          
          <div className="supply-section">
            <h3>生产管理</h3>
            <p>跟踪生产进度和质量控制</p>
            <div className="supply-actions">
              <button className="btn btn-primary">创建生产订单</button>
              <button className="btn btn-secondary">查看生产进度</button>
            </div>
          </div>
          
          <div className="supply-section">
            <h3>成本估算</h3>
            <p>估算生产成本和定价策略</p>
            <div className="supply-actions">
              <button className="btn btn-primary">成本计算器</button>
              <button className="btn btn-secondary">查看历史记录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupplyChain;