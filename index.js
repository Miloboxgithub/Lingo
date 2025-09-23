import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store'; // 确保路径正确
import App from './App';

console.log('Store object:', store); // 验证 store 是否存在

const root = ReactDOM.createRoot(document.getElementById('root'));

// 添加延迟渲染确保 store 就绪
setTimeout(() => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}, 0);