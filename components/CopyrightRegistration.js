import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CopyrightRegistration.css';
import blockchainService from '../services/blockchain';

function CopyrightRegistration() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creator: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 表单验证
    if (!formData.title || !formData.creator || !file) {
      setStatus('请填写完整信息并上传作品文件');
      return;
    }

    try {
      setLoading(true);
      setStatus('正在生成作品哈希...');

      // 生成作品哈希
      const hash = await blockchainService.generateHash(file);
      setStatus('哈希生成成功，正在创建版权存证...');

      // 创建版权存证
      const metadata = {
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      };

      const response = await blockchainService.createCopyright({
        title: formData.title,
        creator: formData.creator,
        hash,
        description: formData.description,
        metadata,
      });

      if (response.success) {
        setStatus('版权存证创建成功！');
        setResult(response);
      } else {
        setStatus(`存证失败: ${response.message}`);
      }
    } catch (error) {
      setStatus(`发生错误: ${error.message}`);
      console.error('版权存证过程出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!result || !result.assetId) {
      setStatus('请先创建版权存证');
      return;
    }

    try {
      setLoading(true);
      setStatus('正在查询存证信息...');

      const response = await blockchainService.queryCopyright(result.assetId);

      if (response.success) {
        setStatus('查询成功');
        setResult({
          ...result,
          details: response.data,
        });
      } else {
        setStatus(`查询失败: ${response.message}`);
      }
    } catch (error) {
      setStatus(`查询出错: ${error.message}`);
      console.error('查询存证信息出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!result || !result.assetId || !file) {
      setStatus('请先创建版权存证并确保已上传文件');
      return;
    }

    try {
      setLoading(true);
      setStatus('正在验证存证...');

      // 重新生成文件哈希进行验证
      const hash = await blockchainService.generateHash(file);
      const response = await blockchainService.verifyCopyright(result.assetId, hash);

      if (response.success) {
        if (response.isValid) {
          setStatus('验证成功！文件与存证匹配');
        } else {
          setStatus('验证失败！文件与存证不匹配');
        }
      } else {
        setStatus(`验证失败: ${response.message}`);
      }
    } catch (error) {
      setStatus(`验证出错: ${error.message}`);
      console.error('验证存证出错:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="copyright-registration">
      <h2>版权存证</h2>
      <p className="subtitle">将您的文创作品存证到区块链，获得不可篡改的版权证明</p>

      {status && <div className={`status-message ${status.includes('成功') ? 'success' : 'error'}`}>{status}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="title">作品标题</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="creator">创作者</label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={formData.creator}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">作品描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="file">上传作品文件</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
          {file && <p className="file-name">已选择: {file.name}</p>}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? '处理中...' : '创建版权存证'}
        </button>
      </form>

      {result && (
        <div className="result-section">
          <h3>存证结果</h3>
          <div className="result-details">
            <p><strong>资产ID:</strong> {result.assetId}</p>
            <p><strong>交易ID:</strong> {result.transactionId}</p>
            <p><strong>区块号:</strong> {result.blockNumber}</p>
            <p><strong>存证时间:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            {result.details && (
              <>:
                <p><strong>存证状态:</strong> {result.details.status}</p>
                <p><strong>作品哈希:</strong> {result.details.hash}</p>
              </>
            )}
          </div>

          <div className="action-buttons">
            <button onClick={handleQuery} disabled={loading}>查询存证信息</button>
            <button onClick={handleVerify} disabled={loading}>验证存证</button>
            <button onClick={() => navigate('/community')}>查看社区</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CopyrightRegistration;