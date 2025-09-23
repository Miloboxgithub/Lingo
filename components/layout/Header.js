import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <h1>文创设计平台</h1>
          </Link>
        </div>
        <nav className="nav-links">
          <ul>
            <li><Link to="/">首页</Link></li>
            <li><Link to="/ai-generator">AIGC生成</Link></li>
            <li><Link to="/design-studio">设计工作室</Link></li>
            <li><Link to="/supply-chain">供应链管理</Link></li>
            <li><Link to="/order-management">订单管理</Link></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn btn-outline">登录</Link>
          <Link to="/register" className="btn">注册</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;