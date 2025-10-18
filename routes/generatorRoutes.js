const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/authUtils');
const User = require('../models/User');
const Work = require('../models/Work');

// AI生成接口
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const { prompt, style, parameters } = req.body;
        
        // 检查用户使用限制
        const user = await User.findById(req.user._id);
        if (user.subscription === 'free' && user.usage.generations >= 50) {
            return res.status(403).json({
                success: false,
                message: '免费用户每月生成次数已达上限'
            });
        }
        
        // 这里是模拟AI生成过程
        // 在实际应用中，这里应该调用真实的AI服务
        const generatedImageUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
        
        // 创建作品记录
        const work = new Work({
            title: `AI生成作品_${Date.now()}`,
            description: prompt,
            creator: req.user._id,
            imageUrl: generatedImageUrl,
            style: style || 'modern',
            parameters: parameters || {},
            isPublic: false
        });
        
        await work.save();
        
        // 更新用户使用统计
        user.usage.generations += 1;
        await user.save();
        
        res.json({
            success: true,
            message: '作品生成成功',
            data: {
                workId: work._id,
                imageUrl: work.imageUrl
            }
        });
    } catch (error) {
        console.error('生成失败:', error);
        res.status(500).json({
            success: false,
            message: '生成失败，请稍后重试',
            error: error.message
        });
    }
});

// 获取生成历史
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        const works = await Work.find({ creator: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('creator', 'username avatar');
        
        const total = await Work.countDocuments({ creator: req.user._id });
        
        res.json({
            success: true,
            data: {
                works,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('获取历史记录失败:', error);
        res.status(500).json({
            success: false,
            message: '获取历史记录失败，请稍后重试',
            error: error.message
        });
    }
});

// 获取可用的艺术风格
router.get('/styles', async (req, res) => {
    try {
        const styles = [
            { value: 'traditional', label: '传统艺术' },
            { value: 'modern', label: '现代艺术' },
            { value: 'ink', label: '水墨画' },
            { value: 'minimalist', label: '极简主义' },
            { value: 'abstract', label: '抽象艺术' },
            { value: 'other', label: '其他风格' }
        ];
        
        res.json({
            success: true,
            data: styles
        });
    } catch (error) {
        console.error('获取风格列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取风格列表失败，请稍后重试',
            error: error.message
        });
    }
});

module.exports = router;