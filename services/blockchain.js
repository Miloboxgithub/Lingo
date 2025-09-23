import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// 区块链服务配置
const BLOCKCHAIN_API_CONFIG = {
  baseURL: process.env.REACT_APP_BLOCKCHAIN_API_URL || 'https://api.example-blockchain.com',
  apiKey: process.env.REACT_APP_BLOCKCHAIN_API_KEY || 'your-api-key-here',
  timeout: 10000,
};

// 创建axios实例
const blockchainAPI = axios.create({
  baseURL: BLOCKCHAIN_API_CONFIG.baseURL,
  timeout: BLOCKCHAIN_API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': BLOCKCHAIN_API_CONFIG.apiKey,
  },
});

/**
 * 创建版权存证
 * @param {Object} data - 存证数据
 * @param {string} data.title - 作品标题
 * @param {string} data.creator - 创作者信息
 * @param {string} data.hash - 作品哈希值
 * @param {string} data.description - 作品描述
 * @param {string} data.timestamp - 创建时间戳
 * @returns {Promise<Object>} 存证结果
 */
export const createCopyright = async (data) => {
  try {
    // 生成唯一标识符
    const assetId = uuidv4();
    
    // 准备存证数据
    const requestData = {
      assetId,
      title: data.title,
      creator: data.creator,
      hash: data.hash,
      description: data.description,
      timestamp: data.timestamp || new Date().toISOString(),
      metadata: data.metadata || {},
    };

    // 调用区块链API
    const response = await blockchainAPI.post('/copyright/create', requestData);

    if (response.data.success) {
      return {
        success: true,
        assetId,
        transactionId: response.data.transactionId,
        blockNumber: response.data.blockNumber,
        timestamp: response.data.timestamp,
      };
    } else {
      throw new Error(response.data.message || '创建版权存证失败');
    }
  } catch (error) {
    console.error('创建版权存证失败:', error);
    return {
      success: false,
      message: error.message || '创建版权存证时发生错误',
    };
  }
};

/**
 * 查询版权存证
 * @param {string} assetId - 资产ID
 * @returns {Promise<Object>} 存证信息
 */
export const queryCopyright = async (assetId) => {
  try {
    const response = await blockchainAPI.get(`/copyright/query/${assetId}`);

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      throw new Error(response.data.message || '查询版权存证失败');
    }
  } catch (error) {
    console.error('查询版权存证失败:', error);
    return {
      success: false,
      message: error.message || '查询版权存证时发生错误',
    };
  }
};

/**
 * 验证版权存证
 * @param {string} assetId - 资产ID
 * @param {string} hash - 作品哈希值
 * @returns {Promise<Object>} 验证结果
 */
export const verifyCopyright = async (assetId, hash) => {
  try {
    const response = await blockchainAPI.post('/copyright/verify', {
      assetId,
      hash,
    });

    return {
      success: response.data.success,
      isValid: response.data.isValid,
      message: response.data.message,
    };
  } catch (error) {
    console.error('验证版权存证失败:', error);
    return {
      success: false,
      message: error.message || '验证版权存证时发生错误',
    };
  }
};

/**
 * 转让版权
 * @param {string} assetId - 资产ID
 * @param {string} newOwner - 新所有者地址
 * @returns {Promise<Object>} 转让结果
 */
export const transferCopyright = async (assetId, newOwner) => {
  try {
    const response = await blockchainAPI.post('/copyright/transfer', {
      assetId,
      newOwner,
    });

    if (response.data.success) {
      return {
        success: true,
        transactionId: response.data.transactionId,
        timestamp: response.data.timestamp,
      };
    } else {
      throw new Error(response.data.message || '转让版权失败');
    }
  } catch (error) {
    console.error('转让版权失败:', error);
    return {
      success: false,
      message: error.message || '转让版权时发生错误',
    };
  }
};

/**
 * 生成作品哈希值
 * @param {File|string} fileOrData - 文件对象或数据字符串
 * @returns {Promise<string>} 哈希值
 */
export const generateHash = async (fileOrData) => {
  try {
    // 这里简化实现，实际项目中应使用加密库如CryptoJS
    if (fileOrData instanceof File) {
      // 处理文件
      const buffer = await fileOrData.arrayBuffer();
      const hash = await crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } else if (typeof fileOrData === 'string') {
      // 处理字符串
      const encoder = new TextEncoder();
      const buffer = encoder.encode(fileOrData);
      const hash = await crypto.subtle.digest('SHA-256', buffer);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } else {
      throw new Error('不支持的输入类型');
    }
  } catch (error) {
    console.error('生成哈希值失败:', error);
    throw error;
  }
};

// 导出所有函数
export default {
  createCopyright,
  queryCopyright,
  verifyCopyright,
  transferCopyright,
  generateHash,
};