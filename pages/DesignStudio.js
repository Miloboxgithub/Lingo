import React from 'react';
import { Link } from 'react-router-dom';
import './DesignStudio.css';

function DesignStudio() {
  return (
    <div className="design-studio-page">
      <div className="design-studio-container">
        <h2>设计工作室</h2>
        <div className="design-studio-content">
          <div className="studio-section">
            <h3>我的设计项目</h3>
            <p>在这里您可以创建、编辑和管理您的设计项目。</p>
            <div className="studio-actions">
              <Link to="/ai-generator" className="btn btn-primary">新建设计项目</Link>
              <button className="btn btn-secondary">导入设计</button>
            </div>
          </div>
          
          <div className="studio-section">
            <h3>设计工具</h3>
            <div className="tools-grid">
              <div className="tool-card">
                <h4>AI生成器</h4>
                <p>使用AI技术生成创意设计</p>
                <Link to="/ai-generator" className="btn btn-primary">使用</Link>
              </div>
              
              <div className="tool-card">
                <h4>模板库</h4>
                <p>浏览和使用设计模板</p>
                <button className="btn btn-primary">浏览</button>
              </div>
              
              <div className="tool-card">
                <h4>素材库</h4>
                <p>丰富的设计素材供您选择</p>
                <button className="btn btn-primary">查看</button>
              </div>
            </div>
          </div>
          
          <div className="studio-section">
            <h3>最近项目</h3>
            <div className="recent-projects">
              <div className="project-card">
                <h4>夏季T恤设计</h4>
                <p>创建于 2023-06-15</p>
                <button className="btn btn-secondary">编辑</button>
              </div>
              
              <div className="project-card">
                <h4>节日贺卡设计</h4>
                <p>创建于 2023-06-10</p>
                <button className="btn btn-secondary">编辑</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignStudio;