const axios = require('axios');

class AIService {
    constructor() {
        this.apiKeys = {
            openai: process.env.OPENAI_API_KEY,
            doubao: process.env.DOUBAO_API_KEY
        };
        
        this.apiUrls = {
            openai: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/images/generations',
            doubao: process.env.DOUBAO_API_URL || 'https://api.doubao.com/v1/images/generations'
        };
    }
    
    // 配置axios实例
    createAxiosInstance(apiType) {
        return axios.create({
            baseURL: this.apiUrls[apiType],
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKeys[apiType]}`
            }
        });
    }
    
    // 调用GPT-4o图像生成
    async callGPT4oImageGeneration(params) {
        try {
            const instance = this.createAxiosInstance('openai');
            const { prompt, style, parameters = {} } = params;
            
            // 构造适合OpenAI API的请求参数
            const requestParams = {
                prompt: `${prompt} in ${style} style`,
                n: 1,
                size: parameters.size || '1024x1024',
                model: 'dall-e-3', // GPT-4o可以结合DALL-E 3进行图像生成
                quality: parameters.quality || 'standard',
                response_format: 'url'
            };
            
            const response = await instance.post('', requestParams);
            
            return {
                success: true,
                data: {
                    imageUrl: response.data.data[0].url
                }
            };
        } catch (error) {
            console.error('调用GPT-4o图像生成失败:', error);
            return {
                success: false,
                message: '调用GPT-4o图像生成失败',
                error: error.message
            };
        }
    }
    
    // 调用字节豆包图像生成
    async callDoubaoImageGeneration(params) {
        try {
            const instance = this.createAxiosInstance('doubao');
            const { prompt, style, parameters = {} } = params;
            
            // 构造适合字节豆包API的请求参数
            const requestParams = {
                prompt: `${prompt} in ${style} style`,
                width: parameters.width || 1024,
                height: parameters.height || 1024,
                model: 'doubao-image-v1',
                quality: parameters.quality || 'high'
            };
            
            const response = await instance.post('', requestParams);
            
            return {
                success: true,
                data: {
                    imageUrl: response.data.data.imageUrl
                }
            };
        } catch (error) {
            console.error('调用字节豆包图像生成失败:', error);
            return {
                success: false,
                message: '调用字节豆包图像生成失败',
                error: error.message
            };
        }
    }
    
    // 统一图像生成方法
    async generateImage(model, params) {
        switch (model.toLowerCase()) {
            case 'gpt-4o':
                return await this.callGPT4oImageGeneration(params);
            case 'doubao':
                return await this.callDoubaoImageGeneration(params);
            default:
                return {
                    success: false,
                    message: '不支持的模型类型'
                };
        }
    }
    
    // 检查API密钥是否配置
    hasValidKeys() {
        return this.apiKeys.openai && this.apiKeys.openai !== 'your_openai_api_key_here' &&
               this.apiKeys.doubao && this.apiKeys.doubao !== 'your_doubao_api_key_here';
    }
    
    // 获取可用的模型列表
    getAvailableModels() {
        return [
            { value: 'gpt-4o', label: 'GPT-4o (DALL-E 3)', provider: 'OpenAI', description: '强大的AI图像生成，支持多种艺术风格' },
            { value: 'doubao', label: '豆包图像生成', provider: '字节跳动', description: '高效的中文AI图像生成，适合中国风格创作' }
        ];
    }
}

module.exports = new AIService();