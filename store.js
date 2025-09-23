import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

console.log('Initializing Redux store...'); // 添加日志

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// 添加调试
if (process.env.NODE_ENV === 'development') {
  window.store = store;
}

export default store;