import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import designReducer from './features/design/designSlice';
import supplyChainReducer from './features/supplyChain/supplyChainSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  design: designReducer,
  supplyChain: supplyChainReducer,
});

export default rootReducer;