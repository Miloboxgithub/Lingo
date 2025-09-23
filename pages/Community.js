import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Community.css';
import { ProductCard } from '../components/ProductCard';
import { FilterBar } from '../components/FilterBar';

// 模拟作品数据
const featuredProducts = [
  {
    id: 1,
    name: '广彩花卉纹样T恤',
    creator: '李明',
    price: 99,
    likes: 124,
    imageUrl: '/products/guangcai-tshirt.png',
    category: 'tshirt',
    style: 'guangcai',
    isForSale: true,
    hasCopyright: true
  },
  {
    id: 2,
    name: '醒狮图腾马克杯',
    creator: '张华',
    price: 69,
    likes: 87,
    imageUrl: '/products/lion-mug.png',
    category: 'mug',
    style: 'liondance',
    isForSale: true,
    hasCopyright: true
  },
  {
    id: 3,
    name: '镬耳屋手机壳',
    creator: '王芳',
    price: 89,
    likes: 156,
    imageUrl: '/products/wokear-house-case.png',
    category: 'phonecase',
    style: 'wokearhouse',
    isForSale: false,
    hasCopyright: true
  },
  {
    id: 4,
    name: '窗花陶瓷盘',
    creator: '赵伟',
    price: 129,
    likes: 98,
    imageUrl: '/products/window-grille-plate.png',
    category: 'ceramic',
    style: 'windowgrille',
    isForSale: true,
    hasCopyright: true
  },
  {
    id: 5,
    name: '龙舟帆布袋',
    creator: '陈静',
    price: 79,
    likes: 67,
    imageUrl: '/products/dragon-boat-bag.png',
    category: 'bag',
    style: 'dragonboat',
    isForSale: true,
    hasCopyright: false
  },
  {
    id: 6,
    name: '粤剧脸谱笔记本',
    creator: '林强',
    price: 59,
    likes: 112,
    imageUrl: '/products/opera-notebook.png',
    category: 'notebook',
    style: 'opera',
    isForSale: true,
    hasCopyright: true
  }
];

const categories = [
  { id: 'all', name: '全部' },
  { id: 'tshirt', name: 'T恤' },
  { id: 'mug', name: '马克杯' },
  { id: 'phonecase', name: '手机壳' },
  { id: 'ceramic', name: '陶瓷' },
  { id: 'bag', name: '帆布袋' },
  { id: 'notebook', name: '笔记本' }
];

const styles = [
  { id: 'all', name: '全部风格' },
  { id: 'guangcai', name: '广彩' },
  { id: 'liondance', name: '醒狮' },
  { id: 'wokearhouse', name: '镬耳屋' },
  { id: 'windowgrille', name: '窗花' },
  { id: 'dragonboat', name: '龙舟' },
  { id: 'opera', name: '粤剧脸谱' }
];

function Community() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 筛选作品
  const filteredProducts = featuredProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStyle = selectedStyle === 'all' || product.style === selectedStyle;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.creator.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesStyle && matchesSearch;
  });

  return (
    <div className="community-page">
      <header className="community-header">
        <h1>文创社区</h1>
        <p>探索粤港传统文化创意，连接创作者与爱好者</p>
      </header>

      <div className="community-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索作品或创作者..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">搜索</button>
        </div>

        <FilterBar
          categories={categories}
          styles={styles}
          selectedCategory={selectedCategory}
          selectedStyle={selectedStyle}
          onCategoryChange={setSelectedCategory}
          onStyleChange={setSelectedStyle}
        />
      </div>

      <section className="featured-section">
        <div className="section-header">
          <h2>热门作品展示</h2>
          <Link to="/all-products" className="view-all-link">查看全部</Link>
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="copyright-section">
        <div className="section-header">
          <h2>版权交易区</h2>
          <Link to="/copyright-market" className="view-all-link">查看全部</Link>
        </div>

        <div className="copyright-grid">
          {featuredProducts
            .filter(product => product.isForSale)
            .map(product => (
              <ProductCard key={product.id} product={product} showPrice={true} />
            ))}
        </div>
      </section>

      <section className="creators-section">
        <div className="section-header">
          <h2>粤港文化认证创作者</h2>
          <Link to="/all-creators" className="view-all-link">查看全部</Link>
        </div>

        <div className="creators-grid">
          <div className="creator-card">
            <div className="creator-avatar">李明</div>
            <h3>李明</h3>
            <p>广彩非遗传承人</p>
            <div className="creator-stats">
              <span>作品: 24</span>
              <span>粉丝: 1.2k</span>
            </div>
            <button className="follow-button">关注</button>
          </div>

          <div className="creator-card">
            <div className="creator-avatar">张华</div>
            <h3>张华</h3>
            <p>醒狮文化设计师</p>
            <div className="creator-stats">
              <span>作品: 18</span>
              <span>粉丝: 856</span>
            </div>
            <button className="follow-button">关注</button>
          </div>

          <div className="creator-card">
            <div className="creator-avatar">王芳</div>
            <h3>王芳</h3>
            <p>岭南建筑纹样设计师</p>
            <div className="creator-stats">
              <span>作品: 32</span>
              <span>粉丝: 1.5k</span>
            </div>
            <button className="follow-button">关注</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Community;