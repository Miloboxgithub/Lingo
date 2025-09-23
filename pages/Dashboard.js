import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h2>仪表盘</h2>
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h3>欢迎使用文创设计平台</h3>
            <p>在这里您可以管理您的设计项目、查看订单状态和供应链信息。</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-item">
              <h4>我的设计</h4>
              <p>查看和管理您的设计作品</p>
              <Link to="/design-studio" className="btn btn-primary">进入设计工作室</Link>
            </div>
            
            <div className="dashboard-item">
              <h4>AIGC生成器</h4>
              <p>使用AI生成创意设计</p>
              <Link to="/ai-generator" className="btn btn-primary">开始创作</Link>
            </div>
            
            <div className="dashboard-item">
              <h4>供应链管理</h4>
              <p>管理供应商和材料信息</p>
              <Link to="/supply-chain" className="btn btn-primary">查看供应链</Link>
            </div>
            
            <div className="dashboard-item">
              <h4>订单管理</h4>
              <p>查看和处理您的订单</p>
              <Link to="/order-management" className="btn btn-primary">查看订单</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;