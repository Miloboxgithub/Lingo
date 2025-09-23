import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>功能导航</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/dashboard" className="nav-item">
              <i className="fas fa-tachometer-alt"></i>
              <span>仪表盘</span>
            </Link>
          </li>
          <li>
            <Link to="/ai-generator" className="nav-item">
              <i className="fas fa-magic"></i>
              <span>AIGC生成器</span>
            </Link>
          </li>
          <li>
            <Link to="/design-studio" className="nav-item">
              <i className="fas fa-palette"></i>
              <span>设计工作室</span>
            </Link>
          </li>
          <li>
            <Link to="/supply-chain" className="nav-item">
              <i className="fas fa-truck"></i>
              <span>供应链管理</span>
            </Link>
          </li>
          <li>
            <Link to="/order-management" className="nav-item">
              <i className="fas fa-shopping-cart"></i>
              <span>订单管理</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className="nav-item">
              <i className="fas fa-user"></i>
              <span>个人资料</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="nav-item">
              <i className="fas fa-cog"></i>
              <span>系统设置</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;