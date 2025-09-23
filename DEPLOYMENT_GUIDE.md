# Lingo 网站部署指南

## 项目概述
这是Lingo文创设计平台的前端代码，包含完整的网站功能。

## 系统要求
- Node.js (v14或更高版本)
- Python 3 (用于运行静态文件服务器)
- 网络连接 (用于安装依赖和访问外部资源)

## 部署步骤

### 1. 复制项目文件
将本目录(frontend/src)下的所有文件复制到目标电脑上的任意位置。

### 2. 安装依赖
打开命令行，进入项目目录，运行：
```bash
npm install
```

### 3. 构建生产版本
```bash
npm run build
```
构建后的文件将生成在 `build` 目录中。

### 4. 启动服务器

#### 开发环境（本地测试）
```bash
python simple_server.py
```
访问: http://localhost:8000/lingo-home.html

#### 生产环境（供他人访问）
```bash
python deploy_server.py
```
访问: http://[您的服务器IP地址]:8080

## 主要文件说明
- `simple_server.py`: 开发环境服务器 (端口8000)
- `deploy_server.py`: 生产环境服务器 (端口8080，绑定所有网络接口)
- `lingo-home.html`: 网站首页
- `package.json`: 项目配置和依赖

## 修复服务器脚本
我注意到服务器脚本缺少必要的导入。请先修复simple_server.py和deploy_server.py文件，在开头添加：
```python
import http.server
```

## 部署到其他电脑的方法

### 方法一：直接复制文件
1. 直接复制整个frontend/src文件夹到目标电脑
2. 修复服务器脚本中的导入问题
3. 运行 `npm install` 安装依赖
4. 运行 `npm run build` 构建项目
5. 启动服务器即可访问网站

### 方法二：使用ZIP打包
1. 在当前目录选中所有文件和文件夹
2. 右键选择"发送到" -> "压缩(zipped)文件夹"
3. 将生成的ZIP文件复制到目标电脑
4. 解压文件
5. 按照上述步骤安装依赖和启动服务器

## 完整文件列表
确保包含以下文件和目录：
- package.json
- package-lock.json
- index.js
- index.css
- App.js
- App.css
- lingo-home.html
- logo.svg
- logo_simple.svg
- simple_server.py (已修复导入)
- deploy_server.py (已修复导入)
- fix_image_urls.py
- .browserslistrc
- .env
- public/
- components/
- pages/
- features/
- services/
- reducers.js
- store.js
- reportWebVitals.js
- ai_generation_history.json
- docs/

## 常见问题
- **图片加载失败**: 运行 `python fix_image_urls.py` 修复图片链接
- **端口被占用**: 关闭占用端口的程序，或修改服务器脚本中的端口号
- **依赖安装失败**: 确保Node.js版本符合要求，并检查网络连接
- **服务器启动错误**: 检查服务器脚本中是否有`import http.server`导入语句

## 注意事项
1. 在生产环境中，请更新 `deploy_server.py` 中的IP地址为您的实际服务器IP
2. 如果遇到端口冲突，可以修改服务器脚本中的端口号
3. 对于大规模部署，建议使用Nginx或Apache等专业Web服务器