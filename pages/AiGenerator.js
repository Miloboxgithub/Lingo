import './AiGenerator.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeDViewer from '../components/ThreeDViewer';
import PatternLibrary from '../components/PatternLibrary';
import MaterialLibrary from '../components/MaterialLibrary';
import ProductTemplates from '../components/ProductTemplates';
import { aiAPI, historyAPI } from '../services/api';

function AiGenerator() {
  const [activeTab, setActiveTab] = useState('pattern');
  const [patternPrompt, setPatternPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [patternStyle, setPatternStyle] = useState('guangcai');
  const [styleIntensity, setStyleIntensity] = useState(70);
  const [patternComplexity, setPatternComplexity] = useState(50);
  const [selectedProduct, setSelectedProduct] = useState('tshirt');
  const [selectedMaterial, setSelectedMaterial] = useState('cotton');
  const [generatedPattern, setGeneratedPattern] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState('text'); // 'text' or 'image'
  const [selectedModel, setSelectedModel] = useState('deepseek'); // 'deepseek' or 'deepseek-r1'
  const [showKeywords, setShowKeywords] = useState(false);
  const [imageWidth, setImageWidth] = useState(512);
  const [imageHeight, setImageHeight] = useState(512);
  const [generateCount, setGenerateCount] = useState(2);
  const [iterations, setIterations] = useState(5);
  const [promptGuidance, setPromptGuidance] = useState(5);
  const [showPatternDetails, setShowPatternDetails] = useState(false); // 新增：控制是否显示纹样详情
  const navigate = useNavigate();

  // 新增的样式定制选项
  const [colorPalette, setColorPalette] = useState('traditional');
  const [artStyle, setArtStyle] = useState('chinese');
  const [textureStyle, setTextureStyle] = useState('smooth');
  const [compositionStyle, setCompositionStyle] = useState('symmetrical');
  const [lineStyle, setLineStyle] = useState('curved');
  const [detailLevel, setDetailLevel] = useState('medium');
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [saturation, setSaturation] = useState(50);
  const [historyItems, setHistoryItems] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [errorMessage, setErrorMessage] = useState('');

  // 加载历史记录
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  // 加载历史记录函数
  const loadHistory = async () => {
    try {
      const response = await historyAPI.getGenerationHistory();
      if (response.data.success) {
        setHistoryItems(response.data.history);
      } else {
        console.error('加载历史记录失败:', response.data.error);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      setErrorMessage('加载历史记录失败，请重试');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // 纹样生成函数 - 调用后端API
  const generatePattern = async () => {
    if (!patternPrompt && generationMode === 'text') {
      setErrorMessage('请输入创意描述');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (generationMode === 'image' && !uploadedImage) {
      setErrorMessage('请上传参考图片');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setIsGenerating(true);
    setErrorMessage('');
    
    try {
      const response = await aiAPI.generateImage({
        prompt: patternPrompt,
        style: patternStyle,
        width: imageWidth,
        height: imageHeight,
        generationMode: generationMode,
        imageUrl: uploadedImage,
        colorPalette: colorPalette,
        artStyle: artStyle,
        textureStyle: textureStyle
      });
      
      if (response.data.success) {
        const newPattern = {
          id: response.data.id,
          imageUrl: response.data.imageUrl,
          prompt: patternPrompt,
          style: patternStyle,
          colorPalette: colorPalette,
          artStyle: artStyle,
          textureStyle: textureStyle,
          timestamp: new Date().toISOString()
        };
        setGeneratedPattern(newPattern);
        
        // 重新加载历史记录
        await loadHistory();
      } else {
        throw new Error(response.data.error || '生成失败');
      }
    } catch (error) {
      console.error('生成纹样失败:', error);
      setErrorMessage('生成纹样失败，请重试');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  // 使用推荐关键词
  const useRecommendedKeyword = (keyword) => {
    setPatternPrompt(prev => prev + ' ' + keyword);
  };

  // 切换生成模式
  const handleGenerationModeChange = (mode) => {
    setGenerationMode(mode);
    // 清空当前输入
    setPatternPrompt('');
    setUploadedImage(null);
  };

  // 前后对比功能
  const toggleBeforeAfter = () => {
    // 实现前后对比逻辑
    console.log('切换前后对比');
  };

  // 保存功能
  const savePattern = () => {
    if (generatedPattern) {
      alert('纹样已保存到您的个人库');
      // 这里应该实现保存到服务器的逻辑
    }
  };

  // 分享功能
  const sharePattern = () => {
    if (generatedPattern) {
      alert('分享链接已复制到剪贴板');
      // 这里应该实现分享逻辑
    }
  };

  // 上传图片函数
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 应用纹样到产品
  const applyPatternToProduct = () => {
    if (!generatedPattern) {
      alert('请先生成或上传纹样');
      return;
    }
    setActiveTab('product');
  };

  // 重新生成纹样
  const regeneratePattern = () => {
    generatePattern();
  };

  // 调整纹样 - 返回生成界面
  const adjustPattern = () => {
    setShowPatternDetails(false);
  };

  // 清除历史记录
  const clearHistory = async () => {
    if (window.confirm('确定要清除所有生成历史吗？')) {
      try {
        const response = await historyAPI.clearHistory();
        if (response.data.success) {
          setHistoryItems([]);
        } else {
          console.error('清除历史记录失败:', response.data.error);
          alert('清除历史记录失败，请重试');
        }
      } catch (error) {
        console.error('清除历史记录失败:', error);
        alert('清除历史记录失败，请重试');
      }
    }
  };

  // 下载纹样
  const downloadPattern = () => {
    if (generatedPattern) {
      const link = document.createElement('a');
      link.href = generatedPattern.imageUrl;
      link.download = `pattern-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="ai-generator-page">
      <header className="generator-header">
        <div className="header-content">
          <h1>创意纹样生成系统</h1>
          <p>基于粤港澳传统文化元素的AI创作平台</p>
        </div>
        <nav className="generator-tabs">
          <button
            className={activeTab === 'pattern' ? 'active' : ''}
            onClick={() => setActiveTab('pattern')}
          >
            <span className="tab-icon">🎨</span>
            纹样生成
          </button>
          <button
            className={activeTab === 'product' ? 'active' : ''}
            onClick={() => setActiveTab('product')}
          >
            <span className="tab-icon">👕</span>
            样机生成
          </button>
          <button
            className={activeTab === 'material' ? 'active' : ''}
            onClick={() => setActiveTab('material')}
          >
            <span className="tab-icon">🧵</span>
            材质赋予
          </button>
          <button
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            <span className="tab-icon">📚</span>
            生成历史
          </button>
        </nav>
      </header>

      <main className="generator-main">
        {activeTab === 'pattern' && (
          <div className="pattern-generator">
            {showPatternDetails ? (
              // 纹样详情区域
              <div className="pattern-details">
                <div className="details-header">
                  <h3>纹样详情</h3>
                  <button 
                    className="back-button"
                    onClick={adjustPattern}
                  >
                    调整纹样
                  </button>
                </div>
                
                <div className="details-content">
                  <div className="detail-section">
                    <h4>创意描述</h4>
                    <p>{generatedPattern?.prompt || '无描述'}</p>
                  </div>
                  
                  <div className="detail-section">
                    <h4>风格参数</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">纹样风格：</span>
                        <span className="detail-value">{getStyleName(generatedPattern?.style)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">色彩方案：</span>
                        <span className="detail-value">{getColorPaletteName(generatedPattern?.colorPalette)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">艺术风格：</span>
                        <span className="detail-value">{getArtStyleName(generatedPattern?.artStyle)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">纹理风格：</span>
                        <span className="detail-value">{getTextureStyleName(generatedPattern?.textureStyle)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">风格强度：</span>
                        <span className="detail-value">{styleIntensity}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">纹样复杂度：</span>
                        <span className="detail-value">{patternComplexity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h4>图像信息</h4>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">尺寸：</span>
                        <span className="detail-value">{imageWidth}×{imageHeight} px</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">生成时间：</span>
                        <span className="detail-value">{generatedPattern?.timestamp ? new Date(generatedPattern.timestamp).toLocaleString() : '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // 原始的生成控制区域
              <div className="generator-controls">
                <div className="input-group">
                  <label>生成模式:</label>
                  <div className="radio-group">
                    <label>
                      <input 
                        type="radio" 
                        name="genMode" 
                        value="text" 
                        checked={generationMode === 'text'} 
                        onChange={() => handleGenerationModeChange('text')}
                      /> 文生图
                    </label>
                    <label>
                      <input 
                        type="radio" 
                        name="genMode" 
                        value="image" 
                        checked={generationMode === 'image'} 
                        onChange={() => handleGenerationModeChange('image')}
                      /> 图生图
                    </label>
                  </div>
                </div>

                {/* AI模型选择 */}
                <div className="model-selection">
                  <button 
                    className={`model-btn ${selectedModel === 'deepseek' ? 'active' : ''}`}
                    onClick={() => setSelectedModel('deepseek')}
                  >
                    DeepSeek
                  </button>
                  <button 
                    className={`model-btn ${selectedModel === 'deepseek-r1' ? 'active' : ''}`}
                    onClick={() => setSelectedModel('deepseek-r1')}
                  >
                    DeepSeek-R1
                  </button>
                </div>

                {/* 创意描述区域 */}
                <div className="input-group">
                  <label htmlFor="patternPrompt">创意描述</label>
                  <div className="creative-description">
                    <textarea
                      id="patternPrompt"
                      value={patternPrompt}
                      onChange={(e) => setPatternPrompt(e.target.value)}
                      placeholder="描述您想要生成的纹样元素，例如：传统纹样表现、飞禽动物、插画风格"
                      rows="3"
                    ></textarea>
                    <button 
                      className="keyword-btn"
                      onClick={() => setShowKeywords(!showKeywords)}
                    >
                      {showKeywords ? '收起关键词' : '推荐关键词'}
                    </button>
                  </div>
                </div>

                {/* 推荐关键词区域 - 增强版 */}
                {showKeywords && (
                  <div className="keywords-panel">
                    <div className="keyword-section">
                      <h4>风格主题</h4>
                      <div className="keyword-tags">
                        {['中国传统元素', '粤港特色', '广彩瓷艺', '岭南文化', '醒狮文化', '镬耳屋', '水乡风情', '现代国潮'].map((keyword) => (
                          <span 
                            key={keyword} 
                            className="keyword-tag"
                            onClick={() => useRecommendedKeyword(keyword)}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="keyword-section">
                      <h4>纹样类型</h4>
                      <div className="keyword-tags">
                        {['几何图案', '花卉纹样', '动物纹样', '山水风景', '人物形象', '文字书法', '抽象艺术', '传统纹样'].map((keyword) => (
                          <span 
                            key={keyword} 
                            className="keyword-tag"
                            onClick={() => useRecommendedKeyword(keyword)}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="keyword-section">
                      <h4>色彩风格</h4>
                      <div className="keyword-tags">
                        {['喜庆红色', '典雅蓝色', '高贵金色', '清新绿色', '复古棕色', '现代灰色', '柔和粉色', '明亮黄色'].map((keyword) => (
                          <span 
                            key={keyword} 
                            className="keyword-tag"
                            onClick={() => useRecommendedKeyword(keyword)}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="keyword-section">
                      <h4>细节与质感</h4>
                      <div className="keyword-tags">
                        {['渐变色彩', '细致纹理', '流畅线条', '无限重复', '精细装饰', '高光质感', '磨砂效果', '水彩晕染'].map((keyword) => (
                          <span 
                            key={keyword} 
                            className="keyword-tag"
                            onClick={() => useRecommendedKeyword(keyword)}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 快速风格预设 */}
                <div className="input-group">
                  <label>快速风格预设:</label>
                  <div className="preset-buttons">
                    {[
                      { name: '经典广彩', keywords: '广彩 瓷器 传统纹样 红色金色' },
                      { name: '岭南风情', keywords: '岭南文化 山水 植物 典雅' },
                      { name: '现代国潮', keywords: '现代 潮流 中国风 简约' },
                      { name: '传统水墨', keywords: '水墨画 中国风 黑白 意境' },
                      { name: '青花瓷韵', keywords: '青花瓷 蓝色 传统 瓷器纹样' }
                    ].map((preset) => (
                      <button 
                        key={preset.name} 
                        className="preset-btn"
                        onClick={() => setPatternPrompt(preset.keywords)}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 上传参考图 - 仅在图生图模式显示 */}
                {generationMode === 'image' && (
                  <div className="input-group">
                    <label>上传参考图:</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {uploadedImage && (
                      <div className="preview-image">
                        <img src={uploadedImage} alt="参考图预览" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* 纹样风格选择 */}
                <div className="input-group">
                  <label>纹样风格:</label>
                  <div className="style-options">
                    <button 
                      className={`style-btn ${patternStyle === 'guangcai' ? 'active' : ''}`}
                      onClick={() => setPatternStyle('guangcai')}
                    >
                      广彩
                    </button>
                    <button 
                      className={`style-btn ${patternStyle === 'chinese' ? 'active' : ''}`}
                      onClick={() => setPatternStyle('chinese')}
                    >
                      中国传统
                    </button>
                    <button 
                      className={`style-btn ${patternStyle === 'modern' ? 'active' : ''}`}
                      onClick={() => setPatternStyle('modern')}
                    >
                      现代简约
                    </button>
                    <button 
                      className={`style-btn ${patternStyle === 'cartoon' ? 'active' : ''}`}
                      onClick={() => setPatternStyle('cartoon')}
                    >
                      卡通风格
                    </button>
                  </div>
                </div>
                
                {/* 风格强度 */}
                <div className="input-group">
                  <label>风格强度: {styleIntensity}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={styleIntensity} 
                    onChange={(e) => setStyleIntensity(parseInt(e.target.value))}
                  />
                </div>
                
                {/* 纹样复杂度 */}
                <div className="input-group">
                  <label>纹样复杂度: {patternComplexity}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={patternComplexity} 
                    onChange={(e) => setPatternComplexity(parseInt(e.target.value))}
                  />
                </div>
                
                {/* 图片尺寸设置 */}
                <div className="input-group">
                  <label>图片尺寸:</label>
                  <div className="size-options">
                    <button 
                      className={`size-btn ${imageWidth === 512 && imageHeight === 512 ? 'active' : ''}`}
                      onClick={() => {setImageWidth(512); setImageHeight(512);}}
                    >
                      512×512
                    </button>
                    <button 
                      className={`size-btn ${imageWidth === 1024 && imageHeight === 1024 ? 'active' : ''}`}
                      onClick={() => {setImageWidth(1024); setImageHeight(1024);}}
                    >
                      1024×1024
                    </button>
                    <button 
                      className={`size-btn ${imageWidth === 768 && imageHeight === 1024 ? 'active' : ''}`}
                      onClick={() => {setImageWidth(768); setImageHeight(1024);}}
                    >
                      768×1024
                    </button>
                  </div>
                </div>
                
                {/* 生成数量 */}
                <div className="input-group">
                  <label>生成数量: {generateCount}张</label>
                  <div className="counter-controls">
                    <button 
                      onClick={() => setGenerateCount(Math.max(1, generateCount - 1))}
                      disabled={generateCount <= 1}
                    >
                      -
                    </button>
                    <span>{generateCount}</span>
                    <button 
                      onClick={() => setGenerateCount(Math.min(10, generateCount + 1))}
                      disabled={generateCount >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* 预计生成时间 */}
                <div className="time-estimate">
                  预计生成时间: {estimatedTime * generateCount}秒
                </div>
                
                {/* 生成按钮 */}
                <button 
                  className="generate-button"
                  onClick={generatePattern}
                  disabled={isGenerating}
                >
                  {isGenerating ? '生成中...' : '生成纹样'}
                </button>
                
                {/* 错误提示 */}
                {errorMessage && (
                  <div className="error-message">
                    {errorMessage}
                  </div>
                )}
              </div>
              
              <div className="generator-preview">
                <div className="preview-header">
                  <h3>纹样预览</h3>
                  <button 
                    className="compare-btn"
                    onClick={toggleBeforeAfter}
                    disabled={!generatedPattern}
                  >
                    前后对比
                  </button>
                </div>
                
                <div className="pattern-result">
                  {isGenerating ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <p>正在生成纹样...</p>
                    </div>
                  ) : generatedPattern ? (
                    <img 
                      src={generatedPattern.imageUrl} 
                      alt="生成的纹样" 
                      className="generated-image"
                    />
                  ) : (
                    <div className="empty-preview">
                      <p>请输入创意描述并点击生成按钮</p>
                    </div>
                  )}
                </div>
                
                <div className="bottom-actions">
                  <button 
                    className="save-btn"
                    onClick={savePattern}
                    disabled={!generatedPattern}
                  >
                    保存纹样
                  </button>
                  <button 
                    className="share-btn"
                    onClick={sharePattern}
                    disabled={!generatedPattern}
                  >
                    分享
                  </button>
                  <button 
                    className="generate-now-btn"
                    onClick={regeneratePattern}
                    disabled={isGenerating}
                  >
                    重新生成
                  </button>
                </div>
                
                <div className="pattern-actions">
                  <button onClick={downloadPattern} disabled={!generatedPattern}>下载</button>
                  <button onClick={applyPatternToProduct} disabled={!generatedPattern}>应用到产品</button>
                  <button onClick={() => setShowPatternDetails(true)} disabled={!generatedPattern}>查看详情</button>
                </div>
                
                {generatedPattern && (
                  <div className="pattern-info">
                    <p><strong>创意描述:</strong> {generatedPattern.prompt}</p>
                    <p><strong>风格:</strong> {generatedPattern.style}</p>
                    <p><strong>色彩方案:</strong> {generatedPattern.colorPalette}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'product' && (
            <div className="product-generator">
              <div className="product-controls">
                <div className="input-group">
                  <label>选择产品模板:</label>
                  <ProductTemplates onSelect={setSelectedProduct} />
                </div>
                
                <div className="input-group">
                  <label>选择材质:</label>
                  <MaterialLibrary onSelect={setSelectedMaterial} />
                </div>
                
                <div className="input-group">
                  <label>定制尺寸:</label>
                  <div className="size-inputs">
                    <input type="number" placeholder="宽度" />
                    <span>×</span>
                    <input type="number" placeholder="高度" />
                    <select>
                      <option value="cm">厘米</option>
                      <option value="inch">英寸</option>
                    </select>
                  </div>
                </div>
                
                <button className="generate-button" disabled={!generatedPattern}>生成样机</button>
              </div>
              
              <div className="product-preview">
                <h3>3D预览</h3>
                <ThreeDViewer product={selectedProduct} pattern={generatedPattern} />
              </div>
            </div>
          )}
          
          {activeTab === 'material' && (
            <div className="material-generator">
              <div className="material-controls">
                <div className="input-group">
                  <label>材质类型:</label>
                  <MaterialLibrary onSelect={setSelectedMaterial} />
                </div>
                
                <div className="input-group">
                  <label>反光度:</label>
                  <input type="range" min="0" max="100" value={30} />
                </div>
                
                <div className="input-group">
                  <label>粗糙度:</label>
                  <input type="range" min="0" max="100" value={70} />
                </div>
                
                <button className="apply-button">应用材质</button>
              </div>
              
              <div className="material-preview">
                <h3>材质预览</h3>
                <div className="preview-container">
                  <div className={`material-sample material-${selectedMaterial}`}></div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="history-tab">
              <div className="timeline-controls">
                <button className="view-btn active">时间轴视图</button>
                <button className="view-btn">网格视图</button>
                <button className="clear-btn" onClick={clearHistory}>清除历史</button>
              </div>
              <div className="history-timeline">
                {historyItems.length > 0 ? (
                  historyItems.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-timestamp">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="history-content">
                        <div className="history-image">
                          <img 
                            src={item.imageUrl} 
                            alt={item.prompt} 
                            className="small-image"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmNWY1ZjUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2dyYWQpIiBkPSJNMjAsMTUwIEwxODAsMzAgQzE4NSwyMCAxNzAsMTAgMTYwLDEwIEwxNTAsMzAgTDUwLDE1MCBMNTAsMTYwIEwxNTAsMTgwIEMxNzAsMTgwIDE5MCwxNjAgMTkwLDE0MCBMMTYwLDUwIEwxNzAsNDAgQzE4MCwzMCAxOTAsMTAgMjAwLDIwIFoiLz48cGF0aCBkPSJNMTQwLDEzMCBMNjAsMTMwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0xNDAgOTAgTDYwIDkwIiBzdHJva2U9IiNjY2MiIHN0cm9rZS13aWR0aD0iNCIvPjxwYXRoIGQ9Ik0xNDAgNTAiIHN0cm9rZT0iI2NjYyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2Utb3BhY2l0eT0iMC41Ii8+PC9zdmc+';
                            }}
                          />
                        </div>
                        <div className="history-details">
                          <h4>{item.prompt}</h4>
                          <p><strong>风格:</strong> {item.style}</p>
                          <div className="history-actions">
                            <button onClick={() => setGeneratedPattern(item)}>重新使用</button>
                          </div>
                        </div>
                      </div>
                    </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>暂无生成历史</p>
                  <button onClick={() => setActiveTab('pattern')}>开始生成</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 辅助函数：获取风格名称
function getStyleName(style) {
  const styleMap = {
    'guangcai': '广彩',
    'chinese': '中国传统',
    'modern': '现代简约',
    'cartoon': '卡通风格'
  };
  return styleMap[style] || style || '未设置';
}

// 辅助函数：获取色彩方案名称
function getColorPaletteName(palette) {
  const paletteMap = {
    'traditional': '传统色彩',
    'bright': '明亮色彩',
    'pastel': '柔和色彩',
    'monochrome': '单色',
    'custom': '自定义'
  };
  return paletteMap[palette] || palette || '未设置';
}

// 辅助函数：获取艺术风格名称
function getArtStyleName(artStyle) {
  const artStyleMap = {
    'chinese': '中国风',
    'guangdong': '广东特色',
    'hongkong': '香港特色',
    'modern': '现代',
    'classical': '古典'
  };
  return artStyleMap[artStyle] || artStyle || '未设置';
}

// 辅助函数：获取纹理风格名称
function getTextureStyleName(texture) {
  const textureMap = {
    'smooth': '平滑',
    'rough': '粗糙',
    'glossy': '光泽',
    'matte': '哑光',
    'patterned': '有图案'
  };
  return textureMap[texture] || texture || '未设置';
}

export default AiGenerator;