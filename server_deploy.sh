#!/bin/bash

# Lingo项目服务器本地部署脚本
# 使用方法：在服务器上运行 ./server_deploy.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目目录配置
PROJECT_DIR="/opt/lingo_project"
CURRENT_DIR=$(pwd)

# 日志文件
LOG_FILE="server_deploy.log"

# 函数：打印消息并记录到日志
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] $message"
    echo -e "$log_entry"
    echo "$log_entry" >> "$LOG_FILE"
}

# 函数：检查命令是否存在
check_command() {
    local cmd="$1"
    if ! command -v "$cmd" &> /dev/null; then
        log_message "${RED}错误: 未找到 $cmd 命令${NC}"
        return 1
    fi
    return 0
}

# 函数：检测操作系统
detect_os() {
    log_message "正在检测操作系统..."
    
    # 调试信息：显示系统文件
    log_message "检查系统文件:"
    log_message "  /etc/redhat-release 存在: $([ -f /etc/redhat-release ] && echo "是" || echo "否")"
    log_message "  /etc/system-release 存在: $([ -f /etc/system-release ] && echo "是" || echo "否")"
    log_message "  /etc/os-release 存在: $([ -f /etc/os-release ] && echo "是" || echo "否")"
    
    if [ -f /etc/redhat-release ]; then
        OS="centos"
        OS_VERSION=$(cat /etc/redhat-release | sed -E 's/.*release ([0-9]+)\..*/\1/')
        log_message "检测到CentOS/RHEL系统: $OS_VERSION"
        echo $OS
        return
    fi
    
    # 检查Alibaba Cloud Linux
    if [ -f /etc/system-release ]; then
        SYSTEM_RELEASE=$(cat /etc/system-release)
        log_message "system-release内容: $SYSTEM_RELEASE"
        if echo "$SYSTEM_RELEASE" | grep -q "Alibaba Cloud Linux"; then
            OS="alibaba"
            OS_VERSION=$(echo "$SYSTEM_RELEASE" | sed -E 's/.*release ([0-9]+)\..*/\1/')
            log_message "检测到Alibaba Cloud Linux系统: $OS_VERSION"
            echo $OS
            return
        fi
    fi
    
    # 检查其他Linux发行版
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
        log_message "检测到操作系统: $OS $OS_VERSION"
        echo $OS
        return
    fi
    
    # 最后尝试uname
    OS=$(uname -s)
    OS_VERSION=$(uname -r)
    log_message "使用uname检测到系统: $OS $OS_VERSION"
    echo $OS
}

# 开始部署
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Lingo项目服务器本地部署脚本       ${NC}"
echo -e "${BLUE}========================================${NC}"
log_message "开始Lingo项目服务器本地部署..."

# 1. 检查当前用户权限
log_message "检查当前用户权限..."
if [[ $EUID -ne 0 ]]; then
    log_message "${YELLOW}警告: 当前不是root用户，某些操作可能需要sudo权限${NC}"
fi

# 2. 创建项目目录
log_message "创建项目目录: $PROJECT_DIR"
sudo mkdir -p "$PROJECT_DIR"
sudo chown $USER:$USER "$PROJECT_DIR"

# 3. 复制项目文件（如果当前目录不是项目目录）
if [[ "$CURRENT_DIR" != "$PROJECT_DIR" ]]; then
    log_message "复制项目文件到 $PROJECT_DIR..."
    
    # 排除不需要复制的文件和目录
    rsync -av --exclude='.git' \
          --exclude='.vs' \
          --exclude='.vscode' \
          --exclude='.pytest_cache' \
          --exclude='node_modules' \
          --exclude='uploads' \
          --exclude='deploy_to_aliyun.sh' \
          --exclude='DeployToAliyun.ps1' \
          --exclude='deploy.log' \
          --exclude='quick_deploy.sh' \
          --exclude='server_deploy.sh' \
          --exclude='DEPLOYMENT_GUIDE.md' \
          "$CURRENT_DIR/" "$PROJECT_DIR/"
    
    if [ $? -ne 0 ]; then
        log_message "${RED}错误: 复制项目文件失败${NC}"
        exit 1
    fi
fi

# 切换到项目目录
cd "$PROJECT_DIR"
log_message "切换到项目目录: $(pwd)"

# 4. 安装Node.js和npm（如果尚未安装）
log_message "检查并安装Node.js环境..."
if ! check_command "node"; then
    log_message "Node.js未安装，开始安装..."
    OS=$(detect_os)
    if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "fedora" || "$OS" == "alibaba" ]]; then
        # CentOS/RHEL/Alibaba Cloud Linux系统
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    else
        # Ubuntu/Debian系统
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    if [ $? -ne 0 ]; then
        log_message "${RED}错误: 安装Node.js失败${NC}"
        exit 1
    fi
fi

log_message "Node.js版本: $(node --version)"
log_message "npm版本: $(npm --version)"

# 5. 安装MongoDB（如果尚未安装）
log_message "检查并安装MongoDB..."
if ! check_command "mongod"; then
    log_message "MongoDB未安装，开始安装..."
    OS=$(detect_os)
    
    if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "fedora" || "$OS" == "alibaba" ]]; then
        # CentOS/RHEL/Alibaba Cloud Linux系统安装MongoDB
        log_message "在$OS系统上安装MongoDB..."
        
        # 创建MongoDB仓库文件
        sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo > /dev/null << EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF
        
        # 安装MongoDB
        sudo yum install -y mongodb-org
        
        # 创建MongoDB数据目录
        sudo mkdir -p /data/db
        sudo chown -R mongod:mongod /data/db
        
        # 启动MongoDB服务
        sudo systemctl start mongod
        sudo systemctl enable mongod
        
    else
        # Ubuntu/Debian系统安装MongoDB
        log_message "在Ubuntu系统上安装MongoDB..."
        
        # 导入MongoDB公钥
        wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
        
        # 添加MongoDB源
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
        
        # 更新包列表并安装MongoDB
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        
        # 启动MongoDB服务
        sudo systemctl start mongod
        sudo systemctl enable mongod
    fi
    
    if [ $? -ne 0 ]; then
        log_message "${RED}错误: 安装MongoDB失败${NC}"
        exit 1
    fi
fi

log_message "检查MongoDB状态..."
sudo systemctl status mongod --no-pager

# 6. 安装项目依赖
log_message "安装项目依赖..."
npm install
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 安装依赖失败${NC}"
    exit 1
fi

# 7. 配置环境变量
log_message "配置环境变量..."
cat > .env << EOF
PORT=3000
MONGO_URI=mongodb://localhost:27017/lingo_db
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
NODE_ENV=production
EOF

log_message "环境变量配置完成"

# 8. 创建uploads目录
log_message "创建uploads目录..."
mkdir -p uploads
chmod -R 777 uploads

# 9. 安装并配置PM2进程管理器
log_message "安装并配置PM2进程管理器..."
if ! check_command "pm2"; then
    sudo npm install -g pm2
fi

# 停止并删除现有应用（如果存在）
pm2 stop lingo-app 2>/dev/null || true
pm2 delete lingo-app 2>/dev/null || true

# 启动应用
pm2 start server.js --name lingo-app

# 设置PM2开机自启
pm2 startup
pm2 save

log_message "PM2应用列表:"
pm2 list

# 10. 安装并配置Nginx
log_message "安装并配置Nginx..."
if ! check_command "nginx"; then
    OS=$(detect_os)
    if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "fedora" || "$OS" == "alibaba" ]]; then
        # CentOS/RHEL/Alibaba Cloud Linux系统安装Nginx
        sudo yum install -y epel-release
        sudo yum install -y nginx
    else
        # Ubuntu/Debian系统安装Nginx
        sudo apt-get update
        sudo apt-get install -y nginx
    fi
fi

# 创建Nginx配置文件
log_message "配置Nginx反向代理..."
sudo tee /etc/nginx/sites-available/lingo > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # 静态文件缓存配置
    location /uploads {
        alias $PROJECT_DIR/uploads;
        expires 30d;
    }
}
EOF

# 启用站点配置
sudo ln -sf /etc/nginx/sites-available/lingo /etc/nginx/sites-enabled/

# 移除默认配置
sudo rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
log_message "测试Nginx配置..."
sudo nginx -t
if [ $? -ne 0 ]; then
    log_message "${RED}错误: Nginx配置测试失败${NC}"
    exit 1
fi

# 重启Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

log_message "检查Nginx状态..."
sudo systemctl status nginx --no-pager

# 11. 配置防火墙
log_message "配置防火墙规则..."
OS=$(detect_os)
if [[ "$OS" == "centos" || "$OS" == "rhel" || "$OS" == "fedora" || "$OS" == "alibaba" ]]; then
    # CentOS/RHEL/Alibaba Cloud Linux系统使用firewalld
    if check_command "firewall-cmd"; then
        sudo firewall-cmd --permanent --add-port=22/tcp
        sudo firewall-cmd --permanent --add-port=80/tcp
        sudo firewall-cmd --permanent --add-port=443/tcp
        sudo firewall-cmd --permanent --add-port=3000/tcp
        sudo firewall-cmd --reload
        sudo firewall-cmd --list-all
    else
        log_message "${YELLOW}firewalld未安装，跳过防火墙配置${NC}"
    fi
else
    # Ubuntu/Debian系统使用ufw
    if check_command "ufw"; then
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 3000/tcp
        sudo ufw --force enable
        sudo ufw status
    else
        log_message "${YELLOW}ufw未安装，跳过防火墙配置${NC}"
    fi
fi

# 部署完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       服务器本地部署完成！           ${NC}"
echo -e "${GREEN}========================================${NC}"
log_message "服务器本地部署完成！"
log_message "项目目录: $PROJECT_DIR"
log_message "PM2应用: lingo-app"
log_message "Nginx配置: /etc/nginx/sites-available/lingo"
log_message "日志文件: $LOG_FILE"

# 显示访问信息
SERVER_IP=$(hostname -I | awk '{print $1}')
log_message "本地访问: http://localhost:3000"
log_message "网络访问: http://$SERVER_IP"
log_message "或通过域名访问配置的域名"

echo -e "${GREEN}部署完成！您可以通过以下地址访问应用：${NC}"
echo -e "${BLUE}http://localhost:3000${NC} (本地)"
echo -e "${BLUE}http://$SERVER_IP${NC} (网络)"
echo -e ""
echo -e "${YELLOW}常用命令：${NC}"
echo -e "查看应用状态: ${BLUE}pm2 list${NC}"
echo -e "查看应用日志: ${BLUE}pm2 logs lingo-app${NC}"
echo -e "重启应用: ${BLUE}pm2 restart lingo-app${NC}"
echo -e "停止应用: ${BLUE}pm2 stop lingo-app${NC}"
