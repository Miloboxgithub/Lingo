# 区块链版权存证功能设置指南

## 所需依赖

要运行区块链版权存证功能，需要安装以下依赖包：

1. **axios** - 用于HTTP请求
2. **uuid** - 用于生成唯一标识符

## 安装步骤

打开终端，导航到项目的frontend目录，运行以下命令：

```bash
npm install axios uuid
```

或者如果使用yarn：

```bash
yarn add axios uuid
```

## 环境变量配置

区块链版权存证功能需要以下环境变量：

1. `REACT_APP_BLOCKCHAIN_API_URL` - 区块链API的基础URL
2. `REACT_APP_BLOCKCHAIN_API_KEY` - 区块链API的访问密钥

### 配置方法

在frontend目录下创建一个`.env`文件，并添加以下内容：

```
REACT_APP_BLOCKCHAIN_API_URL=https://api.example-blockchain.com
REACT_APP_BLOCKCHAIN_API_KEY=your-api-key-here
```
 
请将上述值替换为您实际的区块链API URL和密钥。

## 使用说明

1. 安装依赖并配置环境变量后，重启开发服务器
2. 访问 <mcurl name="版权存证页面" url="http://localhost:3000/copyright-registration"></mcurl> 即可使用版权存证功能
3. 填写作品信息并上传文件，点击"创建版权存证"按钮进行存证
4. 存证成功后，可以查询存证信息或验证存证

## 注意事项

1. 确保您的区块链API服务正常运行并且API密钥有效
2. 大文件存证可能需要较长时间，请耐心等待
3. 存证信息一旦上链，将无法修改或删除
4. 请妥善保管您的API密钥，不要泄露给他人

## 常见问题

### 1. 存证失败怎么办？

- 检查您的网络连接是否正常
- 确认API URL和密钥是否正确
- 检查文件大小是否超过API限制
- 查看控制台错误信息，排查具体问题

### 2. 如何验证存证是否成功？

存证成功后，页面会显示存证结果，包括资产ID、交易ID等信息。您也可以点击"查询存证信息"按钮，获取最新的存证状态。

### 3. 存证的文件类型有什么限制？

目前支持所有常见文件类型，包括图片、文档、音频、视频等。文件大小限制取决于您使用的区块链API服务。