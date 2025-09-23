import React from 'react';
import './OrderManagement.css';

function OrderManagement() {
  return (
    <div className="order-management-page">
      <div className="order-management-container">
        <h2>订单管理</h2>
        <div className="order-management-content">
          <div className="order-section">
            <h3>订单概览</h3>
            <div className="order-stats">
              <div className="stat-card">
                <h4>总订单数</h4>
                <p className="stat-number">24</p>
              </div>
              <div className="stat-card">
                <h4>待处理</h4>
                <p className="stat-number">3</p>
              </div>
              <div className="stat-card">
                <h4>进行中</h4>
                <p className="stat-number">8</p>
              </div>
              <div className="stat-card">
                <h4>已完成</h4>
                <p className="stat-number">13</p>
              </div>
            </div>
          </div>
          
          <div className="order-section">
            <h3>最近订单</h3>
            <div className="order-list">
              <div className="order-item">
                <div className="order-info">
                  <h4>订单 #2024001</h4>
                  <p>夏季T恤设计 - 100件</p>
                  <span className="order-status pending">待处理</span>
                </div>
                <div className="order-actions">
                  <button className="btn btn-primary">查看详情</button>
                  <button className="btn btn-secondary">编辑</button>
                </div>
              </div>
              
              <div className="order-item">
                <div className="order-info">
                  <h4>订单 #2024002</h4>
                  <p>节日贺卡设计 - 500件</p>
                  <span className="order-status processing">进行中</span>
                </div>
                <div className="order-actions">
                  <button className="btn btn-primary">查看详情</button>
                  <button className="btn btn-secondary">编辑</button>
                </div>
              </div>
              
              <div className="order-item">
                <div className="order-info">
                  <h4>订单 #2024003</h4>
                  <p>定制马克杯 - 50件</p>
                  <span className="order-status completed">已完成</span>
                </div>
                <div className="order-actions">
                  <button className="btn btn-primary">查看详情</button>
                  <button className="btn btn-secondary">复制订单</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;