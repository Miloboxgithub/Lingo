import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 获取供应商列表
export const getSuppliers = createAsyncThunk(
  'supplyChain/getSuppliers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/supply-chain/suppliers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取供应商列表失败'
      );
    }
  }
);

// 获取供应商详情
export const getSupplierById = createAsyncThunk(
  'supplyChain/getSupplierById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/supply-chain/suppliers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取供应商详情失败'
      );
    }
  }
);

// 获取材料列表
export const getMaterials = createAsyncThunk(
  'supplyChain/getMaterials',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/supply-chain/materials', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取材料列表失败'
      );
    }
  }
);

// 获取材料详情
export const getMaterialById = createAsyncThunk(
  'supplyChain/getMaterialById',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/supply-chain/materials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '获取材料详情失败'
      );
    }
  }
);

// 成本估算
export const estimateCost = createAsyncThunk(
  'supplyChain/estimateCost',
  async (estimationData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/supply-chain/estimate-cost',
        estimationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '成本估算失败'
      );
    }
  }
);

// 估算生产时间
export const estimateProductionTime = createAsyncThunk(
  'supplyChain/estimateProductionTime',
  async (productionData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/supply-chain/estimate-time',
        productionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || '生产时间估算失败'
      );
    }
  }
);

// 初始状态
const initialState = {
  suppliers: [],
  currentSupplier: null,
  materials: [],
  currentMaterial: null,
  costEstimate: null,
  productionTimeEstimate: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

// 创建slice
const supplyChainSlice = createSlice({
  name: 'supplyChain',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCostEstimate: (state) => {
      state.costEstimate = null;
    },
    clearProductionTimeEstimate: (state) => {
      state.productionTimeEstimate = null;
    },
  },
  extraReducers: (builder) => {
    // 获取供应商列表
    builder
      .addCase(getSuppliers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suppliers = action.payload;
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取供应商详情
    builder
      .addCase(getSupplierById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(getSupplierById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取材料列表
    builder
      .addCase(getMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
      })
      .addCase(getMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 获取材料详情
    builder
      .addCase(getMaterialById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMaterialById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMaterial = action.payload;
      })
      .addCase(getMaterialById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 成本估算
    builder
      .addCase(estimateCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.costEstimate = null;
      })
      .addCase(estimateCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.costEstimate = action.payload;
      })
      .addCase(estimateCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // 估算生产时间
    builder
      .addCase(estimateProductionTime.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.productionTimeEstimate = null;
      })
      .addCase(estimateProductionTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productionTimeEstimate = action.payload;
      })
      .addCase(estimateProductionTime.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, clearCostEstimate, clearProductionTimeEstimate } = supplyChainSlice.actions;
export default supplyChainSlice.reducer;