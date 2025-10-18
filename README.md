# Lingo - 智能文创平台

<p align="center">
  <img src="logo.jpg" alt="Lingo Logo" width="200" height="200">
</p>

<p align="center">
  <strong>用 AI 创造文创新纪元</strong>
</p>

<p align="center">
  <a href="#project-introduction">项目简介</a> •
  <a href="#core-features">核心功能</a> •
  <a href="#tech-stack">技术栈</a> •
  <a href="#quick-start">快速开始</a> •
  <a href="#project-structure">项目结构</a> •
  <a href="#deployment-guide">部署指南</a> •
  <a href="#contributing">贡献指南</a> •
  <a href="#license">许可证</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="版本">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="许可证">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="状态">
  <img src="https://img.shields.io/badge/node.js-18+-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/mongodb-7.0+-green.svg" alt="MongoDB">
</p>

## 🌟 项目简介 <a id="project-introduction"></a>

**Lingo** 是一个基于人工智能的文创设计平台，致力于将传统艺术与现代技术完美融合。通过先进的AI算法，我们赋能创作者快速生成独特的文创设计，从传统纹样到国潮风格，让创意无限延伸。

### ✨ 特色亮点

- 🎨 **AI智能生成** - 基于深度学习的纹样生成算法
- 🏛️ **传统与现代融合** - 结合传统艺术与现代设计趋势
- 🎯 **参数化设计** - 精准控制生成效果
- 👥 **创作者社区** - 活跃的交流分享平台
- 💼 **商业授权** - 完善的版权保护机制
- 🔐 **用户认证系统** - 安全的用户管理和数据保护
- 🚀 **全栈架构** - 现代化的前后端分离设计

## 🚀 核心功能 <a id="core-features"></a>

### 1. AI纹样生成器
- **多种风格选择**：传统纹样、国潮风格、水墨风格、极简主义
- **参数化调节**：复杂度、色彩方案、关键词描述
- **实时预览**：即时生成效果展示
- **批量生成**：支持多种参数组合生成
- **作品保存**：云端存储生成的作品

### 2. 文创展示平台
- **作品展示**：展示用户生成的文创设计
- **社区互动**：点赞、评论、收藏功能
- **版权保护**：水印保护、作品溯源
- **商业授权**：支持作品商业化

### 3. 创作者社区
- **经验分享**：文创设计技巧交流
- **活动参与**：设计大赛、工作坊
- **合作机会**：创作者与品牌对接

### 4. 用户系统
- **用户注册/登录**：安全的身份验证
- **个人中心**：作品管理、个人信息设置
- **会员服务**：免费版、创作者版、企业版

## 🛠️ 技术栈 <a id="tech-stack"></a>

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - 现代样式设计
- **Tailwind CSS** - 实用优先的CSS框架
- **JavaScript** - 交互逻辑实现
- **Font Awesome** - 图标库

### 后端技术
- **Node.js** - 服务器运行环境
- **Express.js** - Web应用框架
- **MongoDB** - NoSQL数据库
- **Mongoose** - MongoDB对象建模工具
- **JWT** - JSON Web Token认证
- **bcryptjs** - 密码加密
- **Multer** - 文件上传处理
- **CORS** - 跨域资源共享

### 开发工具
- **Visual Studio Code** - 代码编辑器
- **Git** - 版本控制
- **Nodemon** - 开发热重载
- **PM2** - 生产环境进程管理

## 🎯 快速开始 <a id="quick-start"></a>

### 环境要求
- Node.js 18+
- MongoDB 7.0+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/Miloboxgithub/Lingo.git
   cd Lingo
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   创建 `.env` 文件：
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/lingo_db
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   UPLOAD_DIR=uploads
   NODE_ENV=development
   ```

4. **启动MongoDB服务**
   ```bash
   # 确保MongoDB服务正在运行
   mongod
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **访问应用**
   打开浏览器访问：`http://localhost:3000`

### 生产部署

项目提供了完整的自动化部署脚本：

#### Linux 部署
```bash
chmod +x ./deploy_to_aliyun.sh
./deploy_to_aliyun.sh
```

#### Windows 部署
```bash
npm run deploy:win
```

#### 快速部署
```bash
chmod +x ./quick_deploy.sh
./quick_deploy.sh
```

## 📁 项目结构 <a id="project-structure"></a>

```
Lingo/
├── 📄 前端文件
│   ├── index.html              # 主页面
│   ├── generator.html          # AI生成器页面
│   ├── works.html              # 作品展示页面
│   ├── community.html          # 社区页面
│   ├── pricing.html            # 定价页面
│   ├── login.html              # 登录页面
│   ├── register.html           # 注册页面
│   ├── profile.html            # 个人中心页面
│   └── index.css               # 样式文件
│
├── 🔧 后端文件
│   ├── server.js               # 主服务器文件
│   ├── package.json            # 项目配置
│   ├── models/                 # 数据模型
│   │   ├── User.js             # 用户模型
│   │   └── Work.js             # 作品模型
│   ├── routes/                 # 路由文件
│   │   ├── authRoutes.js       # 认证路由
│   │   ├── userRoutes.js       # 用户路由
│   │   ├── generatorRoutes.js  # 生成器路由
│   │   └── worksRoutes.js      # 作品路由
│   └── utils/                  # 工具函数
│       ├── aiService.js        # AI服务
│       ├── authUtils.js        # 认证工具
│       └── uploadUtils.js      # 上传工具
│
├── 🚀 部署脚本
│   ├── deploy_to_aliyun.sh     # Linux部署脚本
│   ├── DeployToAliyun.ps1      # Windows部署脚本
│   ├── quick_deploy.sh         # 快速部署脚本
│   ├── server_deploy.sh        # 服务器部署脚本
│   └── server_quick_update.sh  # 快速更新脚本
│
├── 🎨 资源文件
│   ├── logo.jpg                # 项目Logo
│   ├── logo.svg                # SVG Logo
│   ├── logo_simple.svg         # 简化版Logo
│   └── uploads/                # 文件上传目录
│
└── 📝 配置文件
    ├── .gitignore              # Git忽略文件
    └── README.md               # 项目说明
```

### API 接口说明

#### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户退出

#### 用户相关
- `GET /api/users/profile` - 获取用户资料
- `PUT /api/users/profile` - 更新用户资料
- `GET /api/users/works` - 获取用户作品

#### 生成器相关
- `POST /api/generator/generate` - AI纹样生成
- `GET /api/generator/history` - 获取生成历史

#### 作品相关
- `GET /api/works` - 获取作品列表
- `POST /api/works` - 创建作品
- `GET /api/works/:id` - 获取作品详情
- `PUT /api/works/:id` - 更新作品
- `DELETE /api/works/:id` - 删除作品

## 🎨 设计特色 <a id="design-features"></a>

### 视觉设计
- **色彩方案**：以金色(#E6A42A)为主色调，体现文创的典雅与价值
- **字体选择**：Noto Serif SC（中文字体）+ Poppins（英文字体）
- **响应式设计**：完美适配桌面端和移动端
- **交互动效**：流畅的过渡动画和悬停效果

### 用户体验
- **直观操作**：简洁明了的界面设计
- **实时反馈**：操作即时响应
- **渐进增强**：基础功能优先，高级功能渐进
- **安全可靠**：完善的用户认证和数据保护

## 🔧 部署指南 <a id="deployment-guide"></a>

### 本地开发

1. **环境配置**
   ```bash
   # 确保Node.js环境
   node --version
   
   # 确保MongoDB环境
   mongod --version
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **访问测试**
   - 本地访问：`http://localhost:3000`
   - 局域网访问：`http://[你的IP]:3000`

### 生产环境

项目支持一键部署到阿里云服务器，部署脚本会自动完成以下操作：

1. **服务器准备**
   - 自动安装Node.js环境
   - 自动安装MongoDB数据库
   - 自动安装Nginx反向代理
   - 自动配置防火墙规则

2. **项目部署**
   - 上传项目文件到服务器
   - 安装项目依赖
   - 配置环境变量
   - 创建必要目录结构

3. **服务启动**
   - 使用PM2管理Node.js进程
   - 配置Nginx反向代理
   - 设置服务开机自启

4. **监控维护**
   - 使用PM2监控应用状态
   - 配置日志轮转
   - 定期备份数据

### 部署命令

```bash
# Linux部署
./deploy_to_aliyun.sh

# Windows部署
npm run deploy:win

# 快速部署
./quick_deploy.sh

# 服务器快速更新
./server_quick_update.sh
```

## 🤝 贡献指南 <a id="contributing"></a>

我们欢迎所有形式的贡献！请阅读以下指南：

### 报告问题
- 使用 [Issues](https://github.com/Miloboxgithub/Lingo/issues) 报告bug或建议
- 提供详细的问题描述和复现步骤

### 提交代码
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范
- 遵循现有的代码风格
- 添加适当的注释
- 确保代码通过测试
- 更新相关文档

## 📝 更新日志 <a id="changelog"></a>

### v2.0.0 (2025-10-18)
- ✅ **全栈架构升级** - 从静态网站升级为完整的全栈应用
- ✅ **Node.js后端** - 基于Express.js的现代化后端架构
- ✅ **MongoDB数据库** - 集成NoSQL数据库存储
- ✅ **用户认证系统** - JWT认证和用户管理
- ✅ **自动化部署** - 支持一键部署到阿里云服务器
- ✅ **API接口** - 完整的RESTful API设计
- ✅ **文件上传** - 支持作品图片上传和管理

### v1.0.0 (2025-10-10)
- ✅ 基础平台功能完成
- ✅ AI纹样生成器
- ✅ 用户认证系统
- ✅ 响应式设计
- ✅ 部署脚本

## 🐛 常见问题 <a id="faq"></a>

### Q: 如何获得更多生成次数？
A: 免费用户每月有5次生成额度，可以升级到创作者版获得更多生成机会。

### Q: 生成的设计可以商用吗？
A: 免费版仅限个人非商业用途，创作者版和企业版提供商业授权。

### Q: 支持哪些文件格式导出？
A: 目前支持PNG格式导出，后续将支持SVG、JPG等格式。

### Q: 如何保护我的创意？
A: 我们提供水印保护、版权登记和作品溯源等多重保护机制。

### Q: 部署需要什么环境？
A: 需要Node.js 18+和MongoDB 7.0+环境，部署脚本会自动安装所需组件。

### Q: 如何配置数据库连接？
A: 通过环境变量 `MONGO_URI` 配置MongoDB连接字符串。


## 🙏 致谢 <a id="acknowledgments"></a>

感谢所有为这个项目做出贡献的开发者、设计师和测试人员！

---

<p align="center">
  Made with ❤️ by <a href="">Milobox</a>
</p>

<p align="center">
  <sub>如果这个项目对你有帮助，请给个 ⭐️ 支持一下！</sub>
</p>
