import os
import shutil
import zipfile
import sys

# 确保中文显示正常
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def create_deployment_package():
    """创建部署包，包含所有必要的文件"""
    # 设置路径
    project_root = os.path.dirname(os.path.abspath(__file__))
    package_name = "lingo-web-deployment.zip"
    package_path = os.path.join(os.path.dirname(project_root), package_name)
    
    # 创建临时目录用于构建
    temp_dir = os.path.join(os.path.dirname(project_root), "temp_deploy")
    os.makedirs(temp_dir, exist_ok=True)
    
    try:
        print("正在创建部署包...")
        
        # 复制必要的文件和目录
        files_to_copy = [
            "package.json",
            "package-lock.json",
            "index.js",
            "index.css",
            "App.js",
            "App.css",
            "lingo-home.html",
            "logo.svg",
            "logo_simple.svg",
            "simple_server.py",
            "deploy_server.py",
            "fix_image_urls.py",
            ".browserslistrc",
            ".env",
            "public",
            "components",
            "pages",
            "features",
            "services",
            "reducers.js",
            "store.js",
            "reportWebVitals.js",
            "ai_generation_history.json",
            "docs"
        ]
        
        for item in files_to_copy:
            src = os.path.join(project_root, item)
            dst = os.path.join(temp_dir, item)
            
            if os.path.isdir(src):
                if os.path.exists(dst):
                    shutil.rmtree(dst)
                shutil.copytree(src, dst)
                print(f"已复制目录: {item}")
            elif os.path.isfile(src):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
                print(f"已复制文件: {item}")
        
        # 修复服务器脚本中的导入问题
        for server_file in ["simple_server.py", "deploy_server.py"]:
            file_path = os.path.join(temp_dir, server_file)
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # 添加缺失的http.server导入
                if "import http.server" not in content:
                    content = "import http.server\n" + content
                    
                # 替换硬编码的IP地址为更通用的提示
                content = content.replace("47.107.62.221", "[您的服务器IP地址]")
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"已修复服务器脚本: {server_file}")
        
        # 创建README部署指南
        create_readme(temp_dir)
        
        # 创建ZIP文件
        if os.path.exists(package_path):
            os.remove(package_path)
        
        with zipfile.ZipFile(package_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, os.path.dirname(temp_dir))
                    zipf.write(file_path, arcname)
        
        print(f"\n部署包已成功创建: {package_path}")
        print("\n部署指南:")
        print("1. 将此ZIP文件复制到目标服务器")
        print("2. 解压文件")
        print("3. 运行 'npm install' 安装依赖")
        print("4. 运行 'npm run build' 构建生产版本")
        print("5. 使用 'python deploy_server.py' 启动生产服务器")
        
    finally:
        # 清理临时文件
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

def create_readme(dest_dir):
    """创建部署指南README文件"""
    readme_content = """# Lingo 网站部署指南

## 项目概述
这是Lingo文创设计平台的前端代码，包含完整的网站功能。

## 系统要求
- Node.js (v14或更高版本)
- Python 3 (用于运行静态文件服务器)
- 网络连接 (用于安装依赖和访问外部资源)

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式运行
```bash
npm start
# 或使用Python简单服务器
python simple_server.py
```
访问: http://localhost:3000 或 http://localhost:8000/lingo-home.html

### 3. 构建生产版本
```bash
npm run build
```
构建后的文件将生成在 `build` 目录中。

### 4. 部署到生产环境
```bash
# 先构建生产版本
npm run build

# 然后启动部署服务器
python deploy_server.py
```
访问: http://[您的服务器IP地址]:8080

## 主要文件说明
- `simple_server.py`: 开发环境服务器 (端口8000)
- `deploy_server.py`: 生产环境服务器 (端口8080，绑定所有网络接口)
- `lingo-home.html`: 网站首页
- `package.json`: 项目配置和依赖

## 注意事项
1. 确保在生产环境中更新 `deploy_server.py` 中的IP地址为您的实际服务器IP
2. 如果遇到端口冲突，可以修改服务器脚本中的端口号
3. 对于大规模部署，建议使用Nginx或Apache等专业Web服务器

## 常见问题
- **图片加载失败**: 运行 `python fix_image_urls.py` 修复图片链接
- **端口被占用**: 关闭占用端口的程序，或修改服务器脚本中的端口号
- **依赖安装失败**: 确保Node.js版本符合要求，并检查网络连接

"""
    
    readme_path = os.path.join(dest_dir, "DEPLOYMENT_GUIDE.md")
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    
    print("已创建部署指南: DEPLOYMENT_GUIDE.md")

if __name__ == "__main__":
    create_deployment_package()