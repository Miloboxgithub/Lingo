# Lingo项目阿里云服务器自动化部署脚本 (Windows PowerShell版本)
# 使用方法: .\DeployToAliyun.ps1

# 服务器信息
$serverIP = "47.107.62.221"
$serverUser = "root"
$serverPassword = "159862347Gy"
$serverPort = 22

# 项目目录配置
$localProjectDir = Get-Location
$remoteProjectDir = "/opt/lingo_project"

# 日志文件
$logFile = "deploy.log"

# 颜色定义
$RED = "`e[31m"
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$BLUE = "`e[34m"
$NC = "`e[0m"

# 函数：打印消息并记录到日志
function Log-Message {
    param([string]$message, [string]$color = $NC)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $message"
    Write-Host "$color$logEntry$NC"
    Add-Content -Path $logFile -Value $logEntry
}

# 函数：检查命令是否存在
function Check-Command {
    param([string]$command)
    try {
        $null = Get-Command $command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# 开始部署
Write-Host "$BLUE========================================$NC"
Write-Host "$BLUE    Lingo项目阿里云服务器部署脚本     $NC"
Write-Host "$BLUE========================================$NC"
Log-Message "开始部署Lingo项目到阿里云服务器..."

# 1. 检查必要的工具
Log-Message "检查必要的工具..."
if (-not (Check-Command "sshpass")) {
    Log-Message "错误: 未找到sshpass工具，无法自动部署。" -color $RED
    Log-Message "在Windows上，您可以通过以下方式安装sshpass：" -color $YELLOW
    Log-Message "1. 使用Chocolatey: choco install sshpass" -color $YELLOW
    Log-Message "2. 使用Cygwin或WSL安装" -color $YELLOW
    Log-Message "3. 从GitHub下载预编译版本" -color $YELLOW
    Log-Message "部署终止。" -color $RED
    exit 1
}

if (-not (Check-Command "rsync")) {
    Log-Message "错误: 未找到rsync工具。" -color $RED
    Log-Message "在Windows上，您可以通过以下方式安装rsync：" -color $YELLOW
    Log-Message "1. 使用Chocolatey: choco install rsync" -color $YELLOW
    Log-Message "2. 使用Cygwin或WSL安装" -color $YELLOW
    Log-Message "部署终止。" -color $RED
    exit 1
}

# 2. 创建远程项目目录
Log-Message "创建远程项目目录: $remoteProjectDir"
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP "mkdir -p $remoteProjectDir"
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 创建远程目录失败"
    exit 1
}

# 3. 上传项目文件
Log-Message "上传项目文件到服务器..."
# 排除不需要上传的文件和目录
$excludePatterns = @(
    "--exclude=.git",
    "--exclude=.vs",
    "--exclude=.vscode",
    "--exclude=.pytest_cache",
    "--exclude=node_modules",
    "--exclude=uploads",
    "--exclude=deploy_to_aliyun.sh",
    "--exclude=DeployToAliyun.ps1",
    "--exclude=deploy.log"
)

# 使用rsync命令同步文件
sshpass -p $serverPassword rsync -avz -e "ssh -p $serverPort -o StrictHostKeyChecking=no" $excludePatterns "$localProjectDir/" "$serverUser@$serverIP:$remoteProjectDir/"
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 上传文件失败" -color $RED
    exit 1
}

# 4. 在服务器上安装Node.js和npm（如果尚未安装）
Log-Message "检查并安装Node.js环境..."
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP @"
    if ! command -v node &> /dev/null; then
        echo "Node.js未安装，开始安装..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
        apt-get install -y nodejs
    fi
    node --version
    npm --version
"@
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 安装Node.js环境失败"
    exit 1
}

# 5. 在服务器上安装MongoDB（如果尚未安装）
Log-Message "检查并安装MongoDB..."
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP @"
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
"@
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 安装MongoDB失败"
    exit 1
}

# 6. 安装项目依赖
Log-Message "安装项目依赖..."
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP "cd $remoteProjectDir && npm install"
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 安装依赖失败"
    exit 1
}

# 7. 配置环境变量
Log-Message "配置环境变量..."
# 生成随机的JWT密钥
$jwtSecret = [System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

$envContent = @"
PORT=3000
MONGO_URI=mongodb://localhost:27017/lingo_db
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
NODE_ENV=production
"@

$tempEnvFile = New-TemporaryFile
Set-Content -Path $tempEnvFile.FullName -Value $envContent

# 上传.env文件
sshpass -p $serverPassword scp -P $serverPort $tempEnvFile.FullName $serverUser@$serverIP:$remoteProjectDir/.env
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 上传.env文件失败"
    Remove-Item $tempEnvFile.FullName -Force
    exit 1
}
Remove-Item $tempEnvFile.FullName -Force

# 创建uploads目录
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP "cd $remoteProjectDir && mkdir -p uploads && chmod -R 777 uploads"
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 创建uploads目录失败"
    exit 1
}

# 8. 启动服务器（使用PM2管理进程）
Log-Message "安装并配置PM2进程管理器..."
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP @"
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    cd $remoteProjectDir
    pm2 stop lingo-app 2>/dev/null || true
    pm2 delete lingo-app 2>/dev/null || true
    pm2 start server.js --name lingo-app
    pm2 startup
    pm2 save
    pm2 list
"@
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 启动服务器失败" -color $RED
    exit 1
}

# 9. 配置Nginx作为反向代理
Log-Message "安装并配置Nginx..."
$nginxConfig = @"
server {
    listen 80;
    server_name 47.107.62.221 11tn51os17835.vicp.fun;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade `$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host `$host;
        proxy_cache_bypass `$http_upgrade;
    }
    
    # 静态文件缓存配置
    location /uploads {
        alias $remoteProjectDir/uploads;
        expires 30d;
    }
}
"@

$tempNginxFile = New-TemporaryFile
Set-Content -Path $tempNginxFile.FullName -Value $nginxConfig

# 上传Nginx配置
sshpass -p $serverPassword scp -P $serverPort $tempNginxFile.FullName $serverUser@$serverIP:/tmp/lingo_nginx_config
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 上传Nginx配置失败"
    Remove-Item $tempNginxFile.FullName -Force
    exit 1
}
Remove-Item $tempNginxFile.FullName -Force

# 配置Nginx
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP @"
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
"@
if ($LASTEXITCODE -ne 0) {
    Log-Message "错误: 配置Nginx失败" -color $RED
    exit 1
}

# 10. 配置防火墙
Log-Message "配置防火墙规则..."
sshpass -p $serverPassword ssh -p $serverPort -o StrictHostKeyChecking=no $serverUser@$serverIP @"
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
"@
if ($LASTEXITCODE -ne 0) {
    Log-Message "警告: 配置防火墙失败，但部署继续" -color $YELLOW
}

# 部署完成
Write-Host "$GREEN========================================$NC"
Write-Host "$GREEN       部署完成！项目已成功部署        $NC"
Write-Host "$GREEN========================================$NC"
Log-Message "部署完成！项目已成功部署到阿里云服务器。"
Log-Message "访问地址: http://47.107.62.221 或 http://11tn51os17835.vicp.fun"
Log-Message "PM2应用状态: lingo-app"
Log-Message "日志文件: $logFile"

Write-Host "$GREEN部署完成！您可以通过以下地址访问应用：$NC"
Write-Host "$BLUEhttp://47.107.62.221$NC"
Write-Host "$BLUEhttp://11tn51os17835.vicp.fun$NC"
