import http.server
import socketserver
import os

# 设置端口为 8080（非特权端口，不需要管理员权限）
PORT = 8080

# 设置工作目录为当前目录
handler = http.server.SimpleHTTPRequestHandler

try:
    # 创建服务器，绑定到所有网络接口
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        print(f"服务器运行在 http://0.0.0.0:{PORT}")
        print(f"请访问 http://47.107.62.221:{PORT} 查看Lingo网站")
        print("按 Ctrl+C 停止服务器")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("服务器已停止")
except Exception as e:
    print(f"服务器启动失败: {e}")