import React from 'react';
import './PatternLibrary.css';

function PatternLibrary({ onSelect }) {
  // 模拟纹样数据
  const patterns = [
    {
      id: 1,
      name: '广彩花卉',
      style: 'guangcai',
      imageUrl: '/pattern-images/guangcai-1.png',
      description: '传统广彩瓷器纹样，以花卉为主题'
    },
    {
      id: 2,
      name: '醒狮纹样',
      style: 'liondance',
      imageUrl: '/pattern-images/liondance-1.png',
      description: '传统醒狮元素，喜庆热闹'
    },
    {
      id: 3,
      name: '镬耳屋',
      style: 'wokearhouse',
      imageUrl: '/pattern-images/wokearhouse-1.png',
      description: '岭南传统建筑风格元素'
    },
    {
      id: 4,
      name: '传统窗花',
      style: 'windowgrille',
      imageUrl: '/pattern-images/windowgrille-1.png',
      description: '中国传统镂空窗花设计'
    },
    {
      id: 5,
      name: '龙舟竞渡',
      style: 'dragonboat',
      imageUrl: '/pattern-images/dragonboat-1.png',
      description: '端午节传统龙舟元素'
    },
    {
      id: 6,
      name: '广式点心',
      style: 'dim sum',
      imageUrl: '/pattern-images/dimsum-1.png',
      description: '粤式点心文化元素'
    },
    {
      id: 7,
      name: '客家围屋',
      style: 'villagehouse',
      imageUrl: '/pattern-images/villagehouse-1.png',
      description: '客家传统建筑风格'
    },
    {
      id: 8,
      name: '喜庆灯笼',
      style: 'lantern',
      imageUrl: '/pattern-images/lantern-1.png',
      description: '传统喜庆灯笼纹样'
    }
  ];

  // 纹样分类
  const categories = [
    { id: 'all', name: '全部纹样' },
    { id: 'guangcai', name: '广彩' },
    { id: 'liondance', name: '醒狮' },
    { id: 'wokearhouse', name: '镬耳屋' },
    { id: 'windowgrille', name: '窗花' },
    { id: 'dragonboat', name: '龙舟' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // 筛选纹样
  const filteredPatterns = selectedCategory === 'all' 
    ? patterns 
    : patterns.filter(pattern => pattern.style === selectedCategory);

  return (
    <div className="pattern-library-container">
      <div className="pattern-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={selectedCategory === category.id ? 'active' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="pattern-grid">
        {filteredPatterns.map(pattern => (
          <div 
            key={pattern.id} 
            className="pattern-item"
            onClick={() => onSelect && onSelect({
              id: pattern.id,
              imageUrl: pattern.imageUrl,
              prompt: pattern.name,
              style: pattern.style,
              timestamp: new Date().toISOString()
            })}
          >
            <div className="pattern-image-container">
              <div className="pattern-image" style={{backgroundColor: getPatternColor(pattern.style)}}>
                <img 
                  src={pattern.imageUrl} 
                  alt={pattern.name} 
                  className="pattern-thumbnail-img"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2dyYWQpIiBkPSJNMjAsMTUwIEwxODAsMzAgQzE4NSwyMCAxNzAsMTAgMTYwLDEwIEwxNTAsMzAgTDUwLDE1MCBMNTAsMTYwIEwxNTAsMTgwIEMxNzAsMTgwIDE5MCwxNjAgMTkwLDE0MCBMMTYwLDUwIEwxNzAsNDAgQzE4MCwzMCAxOTAsMTAgMjAwLDIwIFoiLz48cGF0aCBkPSJNMTQwLDEzMCBMNjAsMTMwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0xNDAgOTAgTDYwIDkwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0xNDAgNTAiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2Utb3BhY2l0eT0iMC41Ii8+PC9zdmc+';
                  }}
                />
                {!pattern.imageUrl && <div className="pattern-placeholder">{pattern.name}</div>}
              </div>
            </div>
            <h4>{pattern.name}</h4>
            <p>{pattern.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 根据风格获取示例颜色
function getPatternColor(style) {
  const colors = {
    guangcai: '#f8d7da', // 广彩 - 浅红色
    liondance: '#ffe8cc', // 醒狮 - 浅黄色
    wokearhouse: '#e2e8f0', // 镬耳屋 - 浅灰色
    windowgrille: '#d1fae5', // 窗花 - 浅绿色
    dragonboat: '#dbeafe', // 龙舟 - 浅蓝色
    'dim sum': '#fff5f5', // 点心 - 超浅粉色
    villagehouse: '#f9fafb', // 围屋 - 浅灰色
    lantern: '#fef3c7', // 灯笼 - 浅黄色
    opera: '#fce7f3' // 粤剧 - 浅粉色
  };
  return colors[style] || '#f3f4f6';
}

export default PatternLibrary;