#!/bin/bash

# Lingo项目阿里云服务器自动化部署脚本 (Linux版本)
# 使用方法: ./deploy_to_aliyun.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 服务器信息
SERVER_IP="47.107.62.221"
SERVER_USER="root"
SERVER_PASSWORD="159862347Gy"
SERVER_PORT=22

# 项目目录配置
LOCAL_PROJECT_DIR=$(pwd)
REMOTE_PROJECT_DIR="/opt/lingo_project"

# 日志文件
LOG_FILE="deploy.log"

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
        log_message "${YELLOW}请安装 $cmd 工具:${NC}"
        case "$cmd" in
            "sshpass")
                log_message "Ubuntu/Debian: sudo apt-get install sshpass"
                log_message "CentOS/RHEL: sudo yum install sshpass"
                ;;
            "rsync")
                log_message "Ubuntu/Debian: sudo apt-get install rsync"
                log_message "CentOS/RHEL: sudo yum install rsync"
                ;;
        esac
        return 1
    fi
    return 0
}

# 函数：执行远程命令
execute_remote() {
    local command="$1"
    sshpass -p "$SERVER_PASSWORD" ssh -p "$SERVER_PORT" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$command"
    return $?
}

# 函数：上传文件
upload_file() {
    local local_file="$1"
    local remote_file="$2"
    sshpass -p "$SERVER_PASSWORD" scp -P "$SERVER_PORT" -o StrictHostKeyChecking=no "$local_file" "$SERVER_USER@$SERVER_IP:$remote_file"
    return $?
}

# 开始部署
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}    Lingo项目阿里云服务器部署脚本     ${NC}"
echo -e "${BLUE}========================================${NC}"
log_message "开始部署Lingo项目到阿里云服务器..."

# 1. 检查必要的工具
log_message "检查必要的工具..."
if ! check_command "sshpass"; then
    exit 1
fi
if ! check_command "rsync"; then
    exit 1
fi

# 2. 创建远程项目目录
log_message "创建远程项目目录: $REMOTE_PROJECT_DIR"
if ! execute_remote "mkdir -p $REMOTE_PROJECT_DIR"; then
    log_message "${RED}错误: 创建远程目录失败${NC}"
    exit 1
fi

# 3. 上传项目文件
log_message "上传项目文件到服务器..."
# 排除不需要上传的文件和目录
EXCLUDE_PATTERNS=(
    "--exclude=.git"
    "--exclude=.vs"
    "--exclude=.vscode"
    "--exclude=.pytest_cache"
    "--exclude=node_modules"
    "--exclude=uploads"
    "--exclude=deploy_to_aliyun.sh"
    "--exclude=DeployToAliyun.ps1"
    "--exclude=deploy.log"
)

# 使用rsync命令同步文件
sshpass -p "$SERVER_PASSWORD" rsync -avz -e "ssh -p $SERVER_PORT -o StrictHostKeyChecking=no" "${EXCLUDE_PATTERNS[@]}" "$LOCAL_PROJECT_DIR/" "$SERVER_USER@$SERVER_IP:$REMOTE_PROJECT_DIR/"
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 上传文件失败${NC}"
    exit 1
fi

# 4. 在服务器上安装Node.js和npm（如果尚未安装）
log_message "检查并安装Node.js环境..."
execute_remote '
if ! command -v node &> /dev/null; then
    echo "Node.js未安装，开始安装..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
echo "Node.js版本: $(node --version)"
echo "npm版本: $(npm --version)"
'
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 安装Node.js环境失败${NC}"
    exit 1
fi

# 5. 在服务器上安装MongoDB（如果尚未安装）
log_message "检查并安装MongoDB..."
execute_remote '
if ! command -v mongod &> /dev/null; then
    echo "MongoDB未安装，开始安装..."
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update
    apt-get install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
fi
systemctl status mongod --no-pager
'
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 安装MongoDB失败${NC}"
    exit 1
fi

# 6. 安装项目依赖
log_message "安装项目依赖..."
if ! execute_remote "cd $REMOTE_PROJECT_DIR && npm install"; then
    log_message "${RED}错误: 安装依赖失败${NC}"
    exit 1
fi

# 7. 配置环境变量
log_message "配置环境变量..."
ENV_CONTENT="PORT=3000
MONGO_URI=mongodb://localhost:27017/lingo_db
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
NODE_ENV=production"

TEMP_ENV_FILE=$(mktemp)
echo "$ENV_CONTENT" > "$TEMP_ENV_FILE"

# 上传.env文件
if ! upload_file "$TEMP_ENV_FILE" "$REMOTE_PROJECT_DIR/.env"; then
    log_message "${RED}错误: 上传.env文件失败${NC}"
    rm -f "$TEMP_ENV_FILE"
    exit 1
fi
rm -f "$TEMP_ENV_FILE"

# 创建uploads目录
if ! execute_remote "cd $REMOTE_PROJECT_DIR && mkdir -p uploads && chmod -R 777 uploads"; then
    log_message "${RED}错误: 创建uploads目录失败${NC}"
    exit 1
fi

# 8. 启动服务器（使用PM2管理进程）
log_message "安装并配置PM2进程管理器..."
execute_remote '
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi
cd '"$REMOTE_PROJECT_DIR"'
pm2 stop lingo-app 2>/dev/null || true
pm2 delete lingo-app 2>/dev/null || true
pm2 start server.js --name lingo-app
pm2 startup
pm2 save
pm2 list
'
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 启动服务器失败${NC}"
    exit 1
fi

# 9. 配置Nginx作为反向代理
log_message "安装并配置Nginx..."
NGINX_CONFIG="server {
    listen 80;
    server_name 47.107.62.221 11tn51os17835.vicp.fun;
    
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
        alias $REMOTE_PROJECT_DIR/uploads;
        expires 30d;
    }
}"

TEMP_NGINX_FILE=$(mktemp)
echo "$NGINX_CONFIG" > "$TEMP_NGINX_FILE"

# 上传Nginx配置
if ! upload_file "$TEMP_NGINX_FILE" "/tmp/lingo_nginx_config"; then
    log_message "${RED}错误: 上传Nginx配置失败${NC}"
    rm -f "$TEMP_NGINX_FILE"
    exit 1
fi
rm -f "$TEMP_NGINX_FILE"

# 配置Nginx
execute_remote '
if ! command -v nginx &> /dev/null; then
    apt-get update
    apt-get install -y nginx
fi

# 移动配置文件
mv /tmp/lingo_nginx_config /etc/nginx/sites-available/lingo

# 创建符号链接
ln -sf /etc/nginx/sites-available/lingo /etc/nginx/sites-enabled/

# 移除默认配置
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx

# 设置Nginx开机自启
systemctl enable nginx

# 检查Nginx状态
systemctl status nginx --no-pager
'
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 配置Nginx失败${NC}"
    exit 1
fi

# 10. 配置防火墙
log_message "配置防火墙规则..."
execute_remote '
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw --force enable
    ufw status
else
    echo "ufw未安装，跳过防火墙配置"
fi
'
if [ $? -ne 0 ]; then
    log_message "${YELLOW}警告: 配置防火墙失败，但部署继续${NC}"
fi

# 部署完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       部署完成！项目已成功部署        ${NC}"
echo -e "${GREEN}========================================${NC}"
log_message "部署完成！项目已成功部署到阿里云服务器。"
log_message "访问地址: http://47.107.62.221 或 http://11tn51os17835.vicp.fun"
log_message "PM2应用状态: lingo-app"
log_message "日志文件: $LOG_FILE"

echo -e "${GREEN}部署完成！您可以通过以下地址访问应用：${NC}"
echo -e "${BLUE}http://47.107.62.221${NC}"
echo -e "${BLUE}http://11tn51os17835.vicp.fun${NC}"
