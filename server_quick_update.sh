#!/bin/bash

# Lingo项目服务器快速更新脚本
# 使用方法：在服务器项目目录运行 ./server_quick_update.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志文件
LOG_FILE="server_update.log"

# 函数：打印消息并记录到日志
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[$timestamp] $message"
    echo -e "$log_entry"
    echo "$log_entry" >> "$LOG_FILE"
}

# 函数：检测操作系统
detect_os() {
    if [ -f /etc/redhat-release ]; then
        OS="centos"
        OS_VERSION=$(cat /etc/redhat-release | sed -E 's/.*release ([0-9]+)\..*/\1/')
    elif [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    else
        OS=$(uname -s)
        OS_VERSION=$(uname -r)
    fi
    log_message "检测到操作系统: $OS $OS_VERSION"
    echo $OS
}

# 开始快速更新
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}      Lingo项目服务器快速更新脚本      ${NC}"
echo -e "${BLUE}========================================${NC}"
log_message "开始Lingo项目快速更新..."

# 检测操作系统
OS=$(detect_os)

# 1. 检查当前目录
log_message "检查当前目录..."
if [[ ! -f "server.js" ]]; then
    log_message "${RED}错误: 请在项目根目录运行此脚本${NC}"
    log_message "当前目录: $(pwd)"
    log_message "找不到 server.js 文件"
    exit 1
fi

log_message "当前项目目录: $(pwd)"

# 2. 备份当前应用状态
log_message "备份当前应用状态..."
pm2 save
if [ $? -ne 0 ]; then
    log_message "${YELLOW}警告: PM2保存状态失败${NC}"
fi

# 3. 拉取最新代码（如果使用Git）
if [[ -d ".git" ]]; then
    log_message "检测到Git仓库，拉取最新代码..."
    git pull
    if [ $? -ne 0 ]; then
        log_message "${YELLOW}警告: Git拉取失败，继续使用当前代码${NC}"
    fi
else
    log_message "${YELLOW}未检测到Git仓库，请手动更新代码文件${NC}"
    log_message "请确保代码文件已更新到最新版本"
fi

# 4. 安装新的依赖（如果有）
log_message "检查并安装新的依赖..."
if [[ -f "package.json" ]]; then
    # 检查package.json是否有更新
    if [[ -f "package-lock.json" ]]; then
        if [[ "package.json" -nt "package-lock.json" ]] || [[ "package-lock.json" -nt "node_modules" ]]; then
            log_message "检测到依赖更新，重新安装依赖..."
            npm install
            if [ $? -ne 0 ]; then
                log_message "${RED}错误: 安装依赖失败${NC}"
                exit 1
            fi
        else
            log_message "依赖未更新，跳过安装"
        fi
    else
        log_message "安装依赖..."
        npm install
        if [ $? -ne 0 ]; then
            log_message "${RED}错误: 安装依赖失败${NC}"
            exit 1
        fi
    fi
fi

# 5. 重启应用
log_message "重启应用..."
pm2 restart lingo-app
if [ $? -ne 0 ]; then
    log_message "${RED}错误: 重启应用失败${NC}"
    exit 1
fi

# 6. 保存PM2状态
log_message "保存PM2状态..."
pm2 save

# 7. 检查应用状态
log_message "检查应用状态..."
pm2 list

# 8. 显示应用日志（最近10行）
log_message "显示应用最新日志..."
pm2 logs lingo-app --lines 10

# 更新完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}       快速更新完成！应用已更新        ${NC}"
echo -e "${GREEN}========================================${NC}"
log_message "快速更新完成！应用已成功更新。"

# 显示访问信息
SERVER_IP=$(hostname -I | awk '{print $1}')
log_message "本地访问: http://localhost:3000"
log_message "网络访问: http://$SERVER_IP"
log_message "日志文件: $LOG_FILE"

echo -e "${GREEN}快速更新完成！您可以通过以下地址访问更新后的应用：${NC}"
echo -e "${BLUE}http://localhost:3000${NC} (本地)"
echo -e "${BLUE}http://$SERVER_IP${NC} (网络)"
echo -e ""
echo -e "${YELLOW}应用状态信息：${NC}"
echo -e "应用状态: ${GREEN}$(pm2 show lingo-app | grep "status" | head -1 | awk '{print $4}')${NC}"
echo -e "运行时间: ${BLUE}$(pm2 show lingo-app | grep "uptime" | head -1 | awk '{print $4}')${NC}"
echo -e "内存使用: ${BLUE}$(pm2 show lingo-app | grep "memory" | head -1 | awk '{print $4}')${NC}"
echo -e ""
echo -e "${YELLOW}常用命令：${NC}"
echo -e "查看完整日志: ${BLUE}pm2 logs lingo-app${NC}"
echo -e "实时监控: ${BLUE}pm2 monit${NC}"
echo -e "重启应用: ${BLUE}pm2 restart lingo-app${NC}"
