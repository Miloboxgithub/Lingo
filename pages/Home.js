import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [likedItems, setLikedItems] = useState({});
  const [collectedItems, setCollectedItems] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLike = (itemId) => {
    setLikedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCollect = (itemId) => {
    setCollectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <div className="lingo-home">
      {/* 导航栏 */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <div className="navbar-brand">
            <Link to="/" className="logo">
              <span className="logo-text">灵构Lingo</span>
            </Link>
          </div>
          
          <nav className="navbar-main">
            <ul className="nav-links">
              <li><Link to="/" className="active">首页</Link></li>
              <li><Link to="/ai-generator">文创生成</Link></li>
              <li><Link to="/community">社区</Link></li>
              <li><Link to="/help">帮助</Link></li>
            </ul>
          </nav>
          
          <div className="navbar-actions">
            <div className="search-container">
              <input type="text" placeholder="搜索" className="search-input" />
              <button className="search-button">
                <i className="fas fa-search"></i>
              </button>
            </div>
            <Link to="/login" className="login-btn">登录</Link>
            <Link to="/register" className="register-btn">注册</Link>
          </div>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-images">
            <div className="hero-image hero-image-1">
              <div className="image-container">
                <div className="image-frame">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F5F0'/%3E%3Cpath d='M50 50C50 50 180 100 300 50C350 25 350 175 300 200C250 225 50 200 50 100C50 50 50 50 50 50Z' fill='%23E8DED0'/%3E%3Cpath d='M100 100C100 100 180 120 250 100C300 85 300 135 250 150C200 165 100 140 100 120C100 110 100 100 100 100Z' fill='%23DCCAB6'/%3E%3C/svg%3E" alt="传统纹样" className="hero-image-svg" />
                </div>
              </div>
            </div>
            <div className="hero-image hero-image-2">
              <div className="image-container">
                <div className="image-frame">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F5F0'/%3E%3Cpath d='M200 180C200 180 140 240 200 280C260 240 200 180 200 180Z' fill='%23B87E4A'/%3E%3Ccircle cx='200' cy='130' r='60' fill='%23DCCAB6'/%3E%3Ccircle cx='175' cy='120' r='15' fill='%23664A33'/%3E%3Ccircle cx='225' cy='120' r='15' fill='%23664A33'/%3E%3Cpath d='M170 150C170 160 230 160 230 150' stroke='%23664A33' strokeWidth='5' fill='none'/%3E%3C/svg%3E" alt="文创人物" className="hero-image-svg" />
                </div>
              </div>
            </div>
            <div className="hero-image hero-image-3">
              <div className="image-container">
                <div className="image-frame">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F5F0'/%3E%3Cpath d='M200 50C100 100 100 250 200 300C300 250 300 100 200 50Z' fill='%23DCCAB6'/%3E%3Cpath d='M200 70C120 110 120 230 200 270C280 230 280 110 200 70Z' fill='%23E8DED0'/%3E%3Cpath d='M200 300L200 350' stroke='%23664A33' strokeWidth='5'/%3E%3C/svg%3E" alt="传统风扇" className="hero-image-svg" />
                </div>
              </div>
            </div>
            <div className="hero-image hero-image-4">
              <div className="image-container">
                <div className="image-frame">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F9F5F0'/%3E%3Ccircle cx='200' cy='200' r='80' fill='%23DCCAB6'/%3E%3Ccircle cx='200' cy='200' r='50' fill='%23F9F5F0'/%3E%3Ccircle cx='200' cy='200' r='30' fill='%23B87E4A' opacity='0.3'/%3E%3Ccircle cx='200' cy='120' r='15' fill='%23B87E4A'/%3E%3Cpath d='M185 280C185 320 215 320 215 280' fill='none' stroke='%23B87E4A' strokeWidth='8' strokeLinecap='round'/%3E%3C/svg%3E" alt="文创挂饰" className="hero-image-svg" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-text">
            <h1>用 AI 创造文创新纪元</h1>
            <p>探索传统与现代的完美融合，让智能创意为文创产品注入新活力</p>
            <Link to="/ai-generator" className="start-btn">开始创作</Link>
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="features-section">
        <div className="container features-container">
          <h2 className="section-title">核心功能</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-container pattern-icon">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F9F5F0'/%3E%3Cpath d='M10 10L70 10L70 70L10 70L10 10Z' fill='none' stroke='%23B87E4A' strokeWidth='2'/%3E%3Cpath d='M20 20C20 20 40 30 60 20C70 10 70 40 60 50C50 60 20 50 20 30C20 20 20 20 20 20Z' fill='%23DCCAB6'/%3E%3C/svg%3E" alt="纹样生成" className="feature-icon-svg" />
                </div>
              </div>
              <h3>纹样生成</h3>
              <p>唤醒沉睡的美学基因，生成属于你的文化符号，让每个图案都诉说独特故事</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-container mockup-icon">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F9F5F0'/%3E%3Crect x='20' y='15' width='40' height='50' rx='2' fill='%23DCCAB6'/%3E%3Cpath d='M35 65L45 65L45 70L35 70L35 65Z' fill='%23B87E4A'/%3E%3C/svg%3E" alt="样机生成" className="feature-icon-svg" />
                </div>
              </div>
              <h3>样机生成</h3>
              <p>让灵感突破维度限制，即刻看见设计跃于各种载体之上</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-container material-icon">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F9F5F0'/%3E%3Ccircle cx='40' cy='40' r='30' fill='%23DCCAB6'/%3E%3Ccircle cx='40' cy='40' r='15' fill='%23B87E4A' opacity='0.5'/%3E%3C/svg%3E" alt="材质赋予" className="feature-icon-svg" />
                </div>
              </div>
              <h3>材质赋予</h3>
              <p>为创意披上理想外衣，探索质感与色彩的无限组合可能</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-container community-icon">
                  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F9F5F0'/%3E%3Ccircle cx='30' cy='30' r='10' fill='%23B87E4A'/%3E%3Ccircle cx='50' cy='30' r='10' fill='%23B87E4A'/%3E%3Cpath d='M25 60C25 50 30 45 40 45C50 45 55 50 55 60' fill='%23B87E4A'/%3E%3C/svg%3E" alt="社区交流" className="feature-icon-svg" />
                </div>
              </div>
              <h3>社区交流</h3>
              <p>与创作者交流分享，激发更多创意灵感</p>
            </div>
          </div>
        </div>
      </section>

      {/* 热门创作展示 */}
      <section className="trending-section">
        <div className="container trending-container">
          <div className="section-header">
            <h2 className="section-title">热门创作</h2>
            <Link to="/community" className="view-more">查看更多 <i className="fas fa-chevron-right"></i></Link>
          </div>
          
          <div className="trending-grid">
            {[1, 2, 3, 4, 5, 6].map((item) => {
              const likeCount = Math.floor(Math.random() * 100);
              const collectCount = Math.floor(Math.random() * 50);
              const isLiked = likedItems[item] || false;
              const isCollected = collectedItems[item] || false;
              
              return (
                <div className="trending-card" key={item}>
                  <div className="card-image">
                    <div className={`artwork-mask artwork-${item}`}></div>
                    <div className="card-overlay">
                      <button className="quick-action-btn" aria-label="查看详情">
                        <i className="fas fa-search-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="creator-info">
                      <div className={`avatar avatar-${item}`}></div>
                      <span className="creator-name">创作者{item}</span>
                    </div>
                    <div className="card-actions">
                      <button 
                        className={`like-btn ${isLiked ? 'liked' : ''}`} 
                        onClick={() => toggleLike(item)}
                        aria-label={isLiked ? "取消点赞" : "点赞"}
                      >
                        <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
                        <span>{likeCount + (isLiked ? 1 : 0)}</span>
                      </button>
                      <button 
                        className={`collect-btn ${isCollected ? 'collected' : ''}`} 
                        onClick={() => toggleCollect(item)}
                        aria-label={isCollected ? "取消收藏" : "收藏"}
                      >
                        <i className={isCollected ? "fas fa-star" : "far fa-star"}></i>
                        <span>{collectCount + (isCollected ? 1 : 0)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-text">灵构Lingo</span>
              </div>
              <p className="brand-description">
                用AI赋能文创设计，让创意无限可能
              </p>
            </div>
            
            <div className="footer-links">
              <h3>产品服务</h3>
              <ul>
                <li><Link to="/ai-generator">纹样生成</Link></li>
                <li><Link to="/ai-generator">样机生成</Link></li>
                <li><Link to="/ai-generator">材质赋予</Link></li>
                <li><Link to="/community">创作者社区</Link></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h3>关于我们</h3>
              <ul>
                <li><Link to="/about">公司介绍</Link></li>
                <li><Link to="/team">核心团队</Link></li>
                <li><Link to="/partners">合作伙伴</Link></li>
                <li><Link to="/contact">联系我们</Link></li>
              </ul>
            </div>
            
            <div className="footer-links">
              <h3>帮助中心</h3>
              <ul>
                <li><Link to="/faq">常见问题</Link></li>
                <li><Link to="/tutorials">使用教程</Link></li>
                <li><Link to="/privacy">隐私政策</Link></li>
                <li><Link to="/terms">服务条款</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              © 2025 瀚油文化AI共创系统
            </div>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="微信">
                <i className="fab fa-weixin"></i>
              </a>
              <a href="#" className="social-icon" aria-label="微博">
                <i className="fab fa-weibo"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Behance">
                <i className="fab fa-behance"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;