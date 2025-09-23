import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理认证错误和其他常见错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 认证失败，清除token并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

// AI服务相关API
export const aiAPI = {
  generateDesign: (params) => api.post('/ai/generate', params),
  styleTransfer: (params) => api.post('/ai/transfer', params),
  getTemplates: () => api.get('/ai/templates'),
  getStyles: () => api.get('/ai/styles'),
  evaluateDesign: (designId) => api.post('/ai/evaluate', { designId }),
  // 新增：与后端匹配的图像生成API
  generateImage: (params) => api.post('/generate-image', params),
};

// 设计相关API
export const designAPI = {
  getDesigns: () => api.get('/designs'),
  getDesignById: (id) => api.get(`/designs/${id}`),
  createDesign: (designData) => api.post('/designs', designData),
  updateDesign: (id, designData) => api.put(`/designs/${id}`, designData),
  deleteDesign: (id) => api.delete(`/designs/${id}`),
  publishDesign: (id) => api.post(`/designs/${id}/publish`),
  archiveDesign: (id) => api.post(`/designs/${id}/archive`),
  uploadDesignFile: (id, fileData) =>
    api.post(`/designs/${id}/upload`, fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

// 供应链相关API
export const supplyChainAPI = {
  getSuppliers: (filters) => api.get('/supply-chain/suppliers', { params: filters }),
  getSupplierById: (id) => api.get(`/supply-chain/suppliers/${id}`),
  createSupplier: (supplierData) => api.post('/supply-chain/suppliers', supplierData),
  updateSupplier: (id, supplierData) =>
    api.put(`/supply-chain/suppliers/${id}`, supplierData),
  deleteSupplier: (id) => api.delete(`/supply-chain/suppliers/${id}`),
  getMaterials: (filters) => api.get('/supply-chain/materials', { params: filters }),
  getMaterialById: (id) => api.get(`/supply-chain/materials/${id}`),
  createMaterial: (materialData) => api.post('/supply-chain/materials', materialData),
  updateMaterial: (id, materialData) =>
    api.put(`/supply-chain/materials/${id}`, materialData),
  deleteMaterial: (id) => api.delete(`/supply-chain/materials/${id}`),
  estimateCost: (estimationData) =>
    api.post('/supply-chain/estimate-cost', estimationData),
  estimateProductionTime: (productionData) =>
    api.post('/supply-chain/estimate-time', productionData),
  getSupplierRating: (supplierId) =>
    api.get('/supply-chain/supplier-rating', { params: { supplierId } }),
};

// 纹样生成历史相关API
export const historyAPI = {
  // 获取生成历史
  getGenerationHistory: () => api.get('/generation-history'),
  // 清除生成历史
  clearHistory: () => api.post('/clear-history'),
};

export default api;