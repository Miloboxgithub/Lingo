#!/bin/bash

# Lingo项目快速部署脚本 (用于代码更新)
# 使用方法: ./quick_deploy.sh

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
LOG_FILE="quick_deploy.log"

# 函数：打印消息并记录到日志
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] $message"
    echo -e "$log_entry"
    echo "$log_entry" >> "$LOG_FILE"
}

# 函数：执行远程命令
execute_remote() {
    local command="$1"
    sshpass -p "$SERVER_PASSWORD" ssh -p "$SERVER_PORT" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" "$command"
    return $?
}

# 开始快速部署
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}        Lingo项目快速部署脚本         ${NC}"
echo -e "${BLUE}========================================${NC}"
log_message "开始快速部署Lingo项目到阿里云服务器..."

# 1. 检查必要的工具
log_message "检查必要的工具..."
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}错误: 未找到sshpass工具${NC}"
    echo -e "${YELLOW}请安装sshpass: sudo apt-get install sshpass${NC}"
    exit 1
fi

if ! command -v rsync &> /dev/null; then
    echo -e "${RED}错误: 未找到rsync工具${NC}"
    echo -e "${YELLOW}请安装rsync: sudo apt-get install rsync${NC}"
    exit 1
fi

# 2. 备份当前应用状态
log_message "备份当前应用状态..."
execute_remote "
cd $REMOTE_PROJECT_DIR
pm2 save
"

# 3. 上传项目文件（仅更新代码）
log_message "上传更新的项目文件到服务器..."
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
    "--exclude=quick_deploy.sh"
    "--exclude=.env"
)

# 使用rsync命令同步文件（仅更新修改的文件）
sshpass -p "$SERVER_PASSWORD" rsync -avz --delete -e "ssh -p $SERVER_PORT -o StrictHostKeyChecking=no" "${EXCLUDE_PATTERNS[@]}" "$LOCAL_PROJECT_DIR/" "$SERVER_USER@$SERVER_IP:$REMOTE_PROJECT_DIR/"
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 上传文件失败${NC}"
    exit 1
fi

# 4. 安装新的依赖（如果有）
log_message "检查并安装新的依赖..."
if ! execute_remote "cd $REMOTE_PROJECT_DIR && npm install"; then
    log_message "${RED}错误: 安装依赖失败${NC}"
    exit 1
fi

# 5. 重启应用
log_message "重启应用..."
execute_remote "
cd $REMOTE_PROJECT_DIR
pm2 restart lingo-app
pm2 save
"

# 6. 检查应用状态
log_message "检查应用状态..."
execute_remote "
cd $REMOTE_PROJECT_DIR
pm2 list
echo '--- 应用日志 ---'
pm2 logs lingo-app --lines 10
"

# 部署完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       快速部署完成！应用已更新        ${NC}"
echo -e "${GREEN}========================================${NC}"
log_message "快速部署完成！应用已成功更新。"
log_message "访问地址: http://47.107.62.221 或 http://11tn51os17835.vicp.fun"
log_message "PM2应用状态: lingo-app"
log_message "日志文件: $LOG_FILE"

echo -e "${GREEN}快速部署完成！您可以通过以下地址访问更新后的应用：${NC}"
echo -e "${BLUE}http://47.107.62.221${NC}"
echo -e "${BLUE}http://11tn51os17835.vicp.fun${NC}"
