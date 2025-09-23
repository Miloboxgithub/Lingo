import re
import os

# 文件路径
home_file_path = 'lingo-home.html'

# 读取文件内容
with open(home_file_path, 'r', encoding='utf-8') as file:
    content = file.read()

# 正则表达式匹配via.placeholder.com的图片URL
placeholder_pattern = r'https://via\.placeholder\.com/(\d+)x(\d+)/(\w+)/(\w+)\?text=(.*?)"\s+alt="([^"]+)"'

# 替换所有placeholder URL为picsum.photos的URL
def replace_placeholder(match):
    width = match.group(1)
    height = match.group(2)
    text = match.group(5).replace('+', ' ')
    alt = match.group(6)
    
    # 使用picsum.photos服务，添加随机种子确保不同图片
    seed = hash(text) % 1000  # 生成一个基于文本的随机种子
    return f'https://picsum.photos/seed/{seed}/{width}/{height}" alt="{alt}"'

# 执行替换
new_content = re.sub(placeholder_pattern, replace_placeholder, content)

# 保存修改后的文件
with open(home_file_path, 'w', encoding='utf-8') as file:
    file.write(new_content)

print(f'已成功替换 {home_file_path} 中的图片URL')
print(f'替换的图片数量: {len(re.findall(placeholder_pattern, content))}')