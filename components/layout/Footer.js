import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>文创设计平台</h2>
            <p>集AIGC与供应链于一体的文创产品设计解决方案</p>
          </div>
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>平台</h3>
              <ul>
                <li><a href="#">关于我们</a></li>
                <li><a href="#">服务条款</a></li>
                <li><a href="#">隐私政策</a></li>
                <li><a href="#">联系我们</a></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h3>资源</h3>
              <ul>
                <li><a href="#">帮助中心</a></li>
                <li><a href="#">教程</a></li>
                <li><a href="#">API文档</a></li>
                <li><a href="#">社区</a></li>
              </ul>
            </div>
            <div className="footer-links-column">
              <h3>关注我们</h3>
              <ul className="social-links">
                <li><a href="#"><i className="fab fa-weixin"></i> 微信</a></li>
                <li><a href="#"><i className="fab fa-weibo"></i> 微博</a></li>
                <li><a href="#"><i className="fab fa-qq"></i> QQ</a></li>
                <li><a href="#"><i className="fab fa-github"></i> GitHub</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} 文创设计平台. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;