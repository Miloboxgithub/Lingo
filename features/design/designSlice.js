import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 获取设计列表
export const getDesigns = createAsyncThunk(
  'design/getDesigns',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/designs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取设计列表失败'
      );
    }
  }
);

// 获取设计详情
export const getDesignById = createAsyncThunk(
  'design/getDesignById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/designs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取设计详情失败'
      );
    }
  }
);

// 创建设计
export const createDesign = createAsyncThunk(
  'design/createDesign',
  async (designData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/designs', designData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '创建设计失败'
      );
    }
  }
);

// 更新设计
export const updateDesign = createAsyncThunk(
  'design/updateDesign',
  async ({ id, designData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`/api/designs/${id}`, designData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '更新设计失败'
      );
    }
  }
);

// 删除设计
export const deleteDesign = createAsyncThunk(
  'design/deleteDesign',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/designs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '删除设计失败'
      );
    }
  }
);

// AI生成设计
export const generateDesign = createAsyncThunk(
  'design/generateDesign',
  async (designParams, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/ai/generate', designParams, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '生成设计失败'
      );
    }
  }
);

// 风格迁移
export const styleTransfer = createAsyncThunk(
  'design/styleTransfer',
  async ({ designId, styleId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/ai/transfer',
        { designId, styleId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '风格迁移失败'
      );
    }
  }
);

// 获取设计模板
export const getTemplates = createAsyncThunk(
  'design/getTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/ai/templates', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取模板失败'
      );
    }
  }
);

// 获取设计风格
export const getStyles = createAsyncThunk(
  'design/getStyles',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/ai/styles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取风格失败'
      );
    }
  }
);

// 初始状态
const initialState = {
  designs: [],
  currentDesign: null,
  templates: [],
  styles: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

// 创建slice
const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // 获取设计列表
    builder
      .addCase(getDesigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDesigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.designs = action.payload;
      })
      .addCase(getDesigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取设计详情
    builder
      .addCase(getDesignById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDesignById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDesign = action.payload;
      })
      .addCase(getDesignById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 创建设计
    builder
      .addCase(createDesign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.designs.push(action.payload);
        state.successMessage = '设计创建成功';
      })
      .addCase(createDesign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 更新设计
    builder
      .addCase(updateDesign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.designs.findIndex(
          (design) => design.id === action.payload.id
        );
        if (index !== -1) {
          state.designs[index] = action.payload;
        }
        if (state.currentDesign && state.currentDesign.id === action.payload.id) {
          state.currentDesign = action.payload;
        }
        state.successMessage = '设计更新成功';
      })
      .addCase(updateDesign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 删除设计
    builder
      .addCase(deleteDesign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.designs = state.designs.filter(
          (design) => design.id !== action.payload
        );
        if (state.currentDesign && state.currentDesign.id === action.payload) {
          state.currentDesign = null;
        }
        state.successMessage = '设计删除成功';
      })
      .addCase(deleteDesign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // AI生成设计
    builder
      .addCase(generateDesign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateDesign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDesign = action.payload;
      })
      .addCase(generateDesign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 风格迁移
    builder
      .addCase(styleTransfer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(styleTransfer.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentDesign && state.currentDesign.id === action.payload.id) {
          state.currentDesign = action.payload;
        }
      })
      .addCase(styleTransfer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取模板
    builder
      .addCase(getTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取风格
    builder
      .addCase(getStyles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStyles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.styles = action.payload;
      })
      .addCase(getStyles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = designSlice.actions;
export default designSlice.reducer;