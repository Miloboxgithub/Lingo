import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './DesignDocumentation.css';

function DesignDocumentation() {
  const [activeTab, setActiveTab] = useState('flowchart');

  return (
    <div className="design-doc-container">
      <header className="doc-header">
        <h1>文创产品设计平台 - 原型设计文档</h1>
        <p>融合AIGC技术与供应链管理的粤港传统文化文创平台</p>
      </header>

      <nav className="doc-tabs">
        <button
          className={activeTab === 'flowchart' ? 'active' : ''}
          onClick={() => setActiveTab('flowchart')}
        >
          核心生成功能流程图
        </button>
        <button
          className={activeTab === 'trading' ? 'active' : ''}
          onClick={() => setActiveTab('trading')}
        >
          社区版权交易界面
        </button>
        <button
          className={activeTab === 'responsive' ? 'active' : ''}
          onClick={() => setActiveTab('responsive')}
        >
          响应式设计适配方案
        </button>
      </nav>

      <main className="doc-content">
        {activeTab === 'flowchart' && (
          <div className="flowchart-section">
            <h2>核心生成功能交互流程</h2>
            <div className="flowchart-container">
              <div className="flowchart">
                {/* 流程图 SVG */}
                <svg width="100%" height="600" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
                  {/* 背景 */}
                  <rect x="0" y="0" width="1000" height="600" fill="#f9f7f2" />

                  {/* 标题 */}
                  <text x="500" y="30" fontSize="20" textAnchor="middle" fill="#1a365d" fontWeight="bold">
                    文创生成系统交互流程
                  </text>

                  {/* 开始节点 */}
                  <rect x="450" y="60" width="100" height="50" rx="8" fill="#1a365d" />
                  <text x="500" y="90" fontSize="14" textAnchor="middle" fill="white">
                    开始
                  </text>

                  {/* 箭头到产品选择 */}
                  <line x1="500" y1="110" x2="500" y2="140" stroke="#1a365d" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* 产品选择节点 */}
                  <rect x="420" y="140" width="160" height="60" rx="8" fill="#4299e1" />
                  <text x="500" y="175" fontSize="14" textAnchor="middle" fill="white">
                    产品类型选择
                  </text>

                  {/* 箭头到纹样生成 */}
                  <line x1="500" y1="200" x2="500" y2="230" stroke="#1a365d" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* 纹样生成节点 */}
                  <rect x="350" y="230" width="300" height="70" rx="8" fill="#48bb78" />
                  <text x="500" y="260" fontSize="14" textAnchor="middle" fill="white">
                    纹样生成
                  </text>
                  <text x="500" y="285" fontSize="12" textAnchor="middle" fill="white">
                    文生图 / 图生图 / 纹样库选择
                  </text>

                  {/* 箭头到材质选择 */}
                  <line x1="500" y1="300" x2="500" y2="330" stroke="#1a365d" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* 材质选择节点 */}
                  <rect x="380" y="330" width="240" height="60" rx="8" fill="#ed8936" />
                  <text x="500" y="365" fontSize="14" textAnchor="middle" fill="white">
                    材质赋予
                  </text>

                  {/* 箭头到预览 */}
                  <line x1="500" y1="390" x2="500" y2="420" stroke="#1a365d" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* 3D预览节点 */}
                  <rect x="400" y="420" width="200" height="60" rx="8" fill="#9f7aea" />
                  <text x="500" y="455" fontSize="14" textAnchor="middle" fill="white">
                    3D实时预览
                  </text>

                  {/* 箭头到导出 */}
                  <line x1="500" y1="480" x2="500" y2="510" stroke="#1a365d" strokeWidth="2" markerEnd="url(#arrowhead)" />

                  {/* 导出节点 */}
                  <rect x="450" y="510" width="100" height="50" rx="8" fill="#c53030" />
                  <text x="500" y="540" fontSize="14" textAnchor="middle" fill="white">
                    导出/保存
                  </text>

                  {/* 箭头到结束 */}
                  <line x1="500" y1="560" x2="500" y2="580" stroke="#1a365d" strokeWidth="2" />

                  {/* 结束节点 */}
                  <circle cx="500" cy="585" r="15" fill="#1a365d" />

                  {/* 箭头标记定义 */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#1a365d" />
                    </marker>
                  </defs>
                </svg>
              </div>

              <div className="flowchart-description">
                <h3>流程说明</h3>
                <ol>
                  <li><strong>产品类型选择</strong>：用户可从T恤、马克杯、手机壳等多种产品模板中选择</li>
                  <li><strong>纹样生成</strong>：提供三种模式：
                    <ul>
                      <li>文生图：输入文字描述生成纹样</li>
                      <li>图生图：上传参考图片生成相似风格纹样</li>
                      <li>纹样库选择：直接从粤港传统纹样库（广彩、醒狮等）中选择</li>
                    </ul>
                  </li>
                  <li><strong>材质赋予</strong>：选择适合产品的材质（布料、陶瓷、金属等），支持物理属性模拟</li>
                  <li><strong>3D实时预览</strong>：通过Three.js实现的3D预览功能，可旋转、缩放查看效果</li>
                  <li><strong>导出/保存</strong>：导出设计文件，同时保存到生成历史记录中</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div className="trading-section">
            <h2>社区版权交易界面布局</h2>
            <div className="trading-layout">
              {/* 界面布局示意图 */}
              <div className="layout-preview">
                <div className="layout-header">
                  <div className="layout-search">搜索框</div>
                  <div className="layout-user">用户入口</div>
                </div>
                <div className="layout-sidebar">
                  <div className="sidebar-item">社区首页</div>
                  <div className="sidebar-item active">版权交易</div>
                  <div className="sidebar-item">创作者中心</div>
                  <div className="sidebar-item">我的收藏</div>
                  <div className="sidebar-item">帮助中心</div>
                </div>
                <div className="layout-main">
                  <div className="filter-bar">
                    <div className="filter-item">作品分类</div>
                    <div className="filter-item">价格范围</div>
                    <div className="filter-item">风格</div>
                    <div className="filter-item">排序方式</div>
                  </div>
                  <div className="product-grid">
                    <div className="product-card">
                      <div className="card-img">作品图片</div>
                      <div className="card-info">
                        <div className="card-name">作品名称</div>
                        <div className="card-creator">创作者</div>
                        <div className="card-price">¥价格</div>
                      </div>
                      <div className="card-actions">购买按钮</div>
                    </div>
                    <div className="product-card">
                      <div className="card-img">作品图片</div>
                      <div className="card-info">
                        <div className="card-name">作品名称</div>
                        <div className="card-creator">创作者</div>
                        <div className="card-price">¥价格</div>
                      </div>
                      <div className="card-actions">购买按钮</div>
                    </div>
                    <div className="product-card">
                      <div className="card-img">作品图片</div>
                      <div className="card-info">
                        <div className="card-name">作品名称</div>
                        <div className="card-creator">创作者</div>
                        <div className="card-price">¥价格</div>
                      </div>
                      <div className="card-actions">购买按钮</div>
                    </div>
                    <div className="product-card">
                      <div className="card-img">作品图片</div>
                      <div className="card-info">
                        <div className="card-name">作品名称</div>
                        <div className="card-creator">创作者</div>
                        <div className="card-price">¥价格</div>
                      </div>
                      <div className="card-actions">购买按钮</div>
                    </div>
                  </div>
                  <div className="pagination">分页控件</div>
                </div>
              </div>

              <div className="trading-description">
                <h3>界面说明</h3>
                <p>社区版权交易界面采用三栏式布局，兼顾功能完整性和用户体验：</p>
                <ul>
                  <li><strong>顶部栏</strong>：包含全局搜索框和用户入口，方便用户快速搜索和访问个人中心</li>
                  <li><strong>左侧导航</strong>：提供社区相关功能入口，当前选中"版权交易"选项</li>
                  <li><strong>主内容区</strong>：
                    <ul>
                      <li>筛选栏：支持按作品分类、价格范围、风格等多维度筛选</li>
                      <li>作品网格：以卡片形式展示可交易的版权作品，每张卡片包含作品图片、名称、创作者、价格和购买按钮</li>
                      <li>分页控件：方便用户浏览更多作品</li>
                    </ul>
                  </li>
                </ul>
                <h3>版权交易流程</h3>
                <ol>
                  <li>用户浏览或搜索想要购买的版权作品</li>
                  <li>点击作品卡片查看详情</li>
                  <li>确认购买后，进入支付流程</li>
                  <li>支付完成后，系统自动生成版权证书并存储在区块链上</li>
                  <li>用户可在"我的购买"中查看已购买的版权作品和证书</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'responsive' && (
          <div className="responsive-section">
            <h2>响应式设计适配方案</h2>
            <div className="responsive-container">
              <div className="device-previews">
                <div className="device-desktop">
                  <div className="device-header">桌面端 (≥ 1024px)</div>
                  <div className="device-content">
                    <div className="desktop-layout">
                      <div className="desktop-header">顶部栏</div>
                      <div className="desktop-sidebar">侧边栏</div>
                      <div className="desktop-main">主内容区 (多列布局)</div>
                    </div>
                  </div>
                </div>

                <div className="device-tablet">
                  <div className="device-header">平板端 (768px - 1023px)</div>
                  <div className="device-content">
                    <div className="tablet-layout">
                      <div className="tablet-header">顶部栏</div>
                      <div className="tablet-main">主内容区 (双列布局)</div>
                    </div>
                  </div>
                </div>

                <div className="device-mobile">
                  <div className="device-header">移动端 (≤ 767px)</div>
                  <div className="device-content">
                    <div className="mobile-layout">
                      <div className="mobile-header">顶部栏</div>
                      <div className="mobile-menu">菜单按钮</div>
                      <div className="mobile-main">主内容区 (单列布局)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="responsive-description">
                <h3>适配策略</h3>
                <p>平台采用移动优先的响应式设计策略，针对不同设备尺寸进行优化：</p>
                <ul>
                  <li><strong>桌面端 (≥ 1024px)</strong>：
                    <ul>
                      <li>三栏布局：顶部栏 + 侧边栏 + 主内容区</li>
                      <li>主内容区采用多列网格布局，展示更多内容</li>
                      <li>完整展示所有功能和控件</li>
                    </ul>
                  </li>
                  <li><strong>平板端 (768px - 1023px)</strong>：
                    <ul>
                      <li>双栏布局：顶部栏 + 主内容区</li>
                      <li>侧边栏转为可折叠菜单</li>
                      <li>主内容区采用双列网格布局</li>
                      <li>优化触摸目标大小，提升交互体验</li>
                    </ul>
                  </li>
                  <li><strong>移动端 (≤ 767px)</strong>：
                    <ul>
                      <li>单列布局：顶部栏 + 主内容区</li>
                      <li>侧边栏转为底部导航或抽屉式菜单</li>
                      <li>主内容区采用单列布局，垂直滚动</li>
                      <li>简化控件和表单，减少输入操作</li>
                      <li>重点优化生成流程，确保在小屏幕上也能顺畅使用</li>
                    </ul>
                  </li>
                </ul>
                <h3>关键优化点</h3>
                <ul>
                  <li>生成页面：在移动端将双栏布局改为上下布局，工作区在上，预览区在下</li>
                  <li>触控目标：所有可点击元素尺寸不小于44×44px，符合移动端触控标准</li>
                  <li>图片加载：采用渐进式加载和响应式图片，提升移动端加载速度</li>
                  <li>手势支持：为3D预览功能添加手势控制支持，方便移动端操作</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default DesignDocumentation;