import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里应该连接到后端API进行登录验证
    // 暂时使用模拟登录
    if (email && password) {
      // 登录成功，跳转到仪表盘
      navigate('/dashboard');
    } else {
      setError('请输入邮箱和密码');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>用户登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">登录</button>
        </form>
        <div className="login-footer">
          <p>还没有账户? <Link to="/register">立即注册</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;