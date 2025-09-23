import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function ThreeDViewer({ product, pattern }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const productMeshRef = useRef(null);

  // 初始化Three.js场景
  useEffect(() => {
    if (!containerRef.current) return;

    // 创建场景
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xf3f4f6);

    // 创建相机
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current.position.z = 5;

    // 创建渲染器
    rendererRef.current = new THREE.WebGLRenderer({
      antialias: true,
    });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(rendererRef.current.domElement);

    // 添加轨道控制器
    controlsRef.current = new OrbitControls(
      cameraRef.current,
      rendererRef.current.domElement
    );
    controlsRef.current.enableDamping = true;

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    sceneRef.current.add(directionalLight);

    // 加载产品模型
    loadProductModel(product);

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);
      controlsRef.current.update();
      rendererRef.current.render(
        sceneRef.current,
        cameraRef.current
      );
    };
    animate();

    // 窗口大小变化处理
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // 当产品或纹样变化时更新
  useEffect(() => {
    if (sceneRef.current && productMeshRef.current) {
      sceneRef.current.remove(productMeshRef.current);
      loadProductModel(product);
    }
  }, [product, pattern]);

  // 加载产品模型
  const loadProductModel = (productType) => {
    // 根据产品类型创建简单的几何模型（实际应用中应加载3D模型）
    let geometry;
    let material;

    switch (productType) {
      case 'tshirt':
        // 创建T恤模型（简化为平面）
        geometry = new THREE.PlaneGeometry(3, 4, 10, 10);
        material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        break;
      case 'mug':
        // 创建杯子模型（简化为圆柱体）
        geometry = new THREE.CylinderGeometry(1, 1, 2.5, 32);
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        break;
      case 'phonecase':
        // 创建手机壳模型（简化为长方体）
        geometry = new THREE.BoxGeometry(1.5, 3, 0.3);
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        break;
      case 'ceramic':
        // 创建陶瓷模型（简化为球体的一部分）
        geometry = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.8);
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        break;
      case 'bag':
        // 创建帆布袋模型（简化为平面）
        geometry = new THREE.PlaneGeometry(3.5, 3, 10, 10);
        material = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          side: THREE.DoubleSide,
        });
        break;
      case 'notebook':
        // 创建笔记本模型（简化为长方体）
        geometry = new THREE.BoxGeometry(2, 2.8, 0.4);
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        break;
      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
        material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    }

    // 如果有纹样，应用到材质上
    if (pattern && pattern.imageUrl) {
      try {
        // 创建纹理加载器
        const textureLoader = new THREE.TextureLoader();
        // 设置纹理加载完成后的回调
        textureLoader.load(
          pattern.imageUrl,
          // 加载成功回调
          (texture) => {
            // 设置纹理的重复和包裹方式
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1);
            
            // 应用纹理到材质
            material.map = texture;
            material.needsUpdate = true;
            
            // 更新网格
            if (productMeshRef.current) {
              productMeshRef.current.material = material;
            }
          },
          // 加载进度回调
          undefined,
          // 加载错误回调
          () => {
            console.warn('纹理加载失败，使用默认纹样');
            // 使用默认的纹样生成函数
            const texture = new THREE.CanvasTexture(
              createPatternCanvas(pattern.style || 'default')
            );
            material.map = texture;
            material.needsUpdate = true;
          }
        );
      } catch (error) {
        console.error('应用纹理时出错:', error);
        // 出错时使用默认的纹样生成函数
        const texture = new THREE.CanvasTexture(
          createPatternCanvas(pattern.style || 'default')
        );
        material.map = texture;
        material.needsUpdate = true;
      }
    } else if (pattern) {
      // 如果有纹样但没有imageUrl，使用默认的纹样生成函数
      const texture = new THREE.CanvasTexture(
        createPatternCanvas(pattern.style || 'default')
      );
      material.map = texture;
      material.needsUpdate = true;
    }

    productMeshRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(productMeshRef.current);
  };

  // 创建简单的纹样画布（实际应用中应使用真实图片）
  const createPatternCanvas = (style) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // 根据风格生成不同的简单图案
    switch (style) {
      case 'guangcai':
        // 广彩风格（简化为彩色斑点）
        ctx.fillStyle = '#f8f0e3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const colors = ['#c53030', '#1a365d', '#e6a23c', '#4096ff', '#73c0de'];
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 10 + 5;
          const color = colors[Math.floor(Math.random() * colors.length)];

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
        break;
      case 'liondance':
        // 醒狮风格（简化为红色和金色）
        ctx.fillStyle = '#c53030';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#e6a23c';
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = Math.random() * 30 + 20;

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + size, y + size / 2);
          ctx.lineTo(x, y + size);
          ctx.closePath();
          ctx.fill();
        }
        break;
      case 'wokearhouse':
        // 镬耳屋风格（简化为灰色和白色）
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#4b5563';
        for (let i = 0; i < 5; i++) {
          const x = 50 + i * 40;
          const height = 80 + Math.random() * 40;

          // 镬耳形状
          ctx.beginPath();
          ctx.moveTo(x, canvas.height);
          ctx.lineTo(x, canvas.height - height);
          ctx.quadraticCurveTo(
            x + 20, canvas.height - height - 30,
            x + 40, canvas.height - height
          );
          ctx.lineTo(x + 40, canvas.height);
          ctx.closePath();
          ctx.fill();
        }
        break;
      case 'windowgrille':
        // 窗花风格（简化为几何图案）
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#1a365d';
        ctx.lineWidth = 2;
        
        // 绘制几何花纹
        for (let x = 0; x <= canvas.width; x += 40) {
          for (let y = 0; y <= canvas.height; y += 40) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y + 40);
            ctx.moveTo(x + 40, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();
          }
        }
        break;
      case 'dragonboat':
        // 龙舟风格（简化为蓝色和红色）
        ctx.fillStyle = '#dbeafe';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#c53030';
        for (let i = 0; i < 5; i++) {
          const y = 30 + i * 40;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.quadraticCurveTo(canvas.width / 2, y - 20, canvas.width, y);
          ctx.lineWidth = 5;
          ctx.strokeStyle = '#c53030';
          ctx.stroke();
        }
        break;
      case 'dim sum':
        // 点心风格（简化为食物图案）
        ctx.fillStyle = '#fff5f5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制圆形图案代表点心
        const dimSumColors = ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa'];
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const radius = Math.random() * 15 + 10;
          const color = dimSumColors[Math.floor(Math.random() * dimSumColors.length)];
          
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
          
          // 添加简单装饰
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        break;
      case 'villagehouse':
        // 围屋风格（简化为圆形建筑图案）
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 2;
        
        // 绘制圆形建筑
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
        ctx.stroke();
        
        // 添加建筑细节
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const x = canvas.width / 2 + Math.cos(angle) * 80;
          const y = canvas.height / 2 + Math.sin(angle) * 80;
          
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, canvas.height / 2);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        break;
      case 'lantern':
        // 灯笼风格（简化为红色灯笼图案）
        ctx.fillStyle = '#fef3c7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < 3; i++) {
          const y = 60 + i * 60;
          // 绘制灯笼
          ctx.beginPath();
          ctx.ellipse(canvas.width / 2, y, 30, 40, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#c53030';
          ctx.fill();
          
          // 添加灯笼装饰
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 25, y);
          ctx.lineTo(canvas.width / 2 + 25, y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, y - 35);
          ctx.lineTo(canvas.width / 2, y + 35);
          ctx.stroke();
        }
        break;
      default:
        // 默认纹样
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加简单的格子图案
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= canvas.width; i += 20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        
        for (let i = 0; i <= canvas.height; i += 20) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
    }

    return canvas;
  };

  return (
    <div
      ref={containerRef}
      className="three-d-viewer"
      style={{ width: '100%', height: '400px' }}
    />
  );
}

export default ThreeDViewer;