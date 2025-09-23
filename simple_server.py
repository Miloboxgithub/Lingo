import http.server
import socketserver
import os

# 设置端口为 8000（更常见的端口）
PORT = 8000

# 设置工作目录为当前目录
handler = http.server.SimpleHTTPRequestHandler

try:
    # 创建服务器
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"服务器运行在 http://localhost:{PORT}")
        print(f"请访问 http://localhost:{PORT}/lingo-home.html 查看Lingo首页")
        print("按 Ctrl+C 停止服务器")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("服务器已停止")
except Exception as e:
    print(f"服务器启动失败: {e}")