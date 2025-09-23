# 📺 Video MVP - Video.js 演示项目

基于 Vite 的 Video.js 演示项目，展示如何通过 API 控制播放器功能并实时监控事件。

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

服务器启动后：
- **桌面端访问**: http://localhost:5173/
- **移动端测试**: 扫描页面上的二维码

## 🎯 功能特点

### ✅ 启用的功能
- 播放/暂停控制
- 音量调节
- 全屏模式

### ❌ 禁用的功能
- **进度条拖拽** (通过 Video.js API 禁用)
- **点击跳转** (进度条点击)
- **触摸滑动** (移动端)
- **倍速播放** (完全禁用，锁定为1x)

### 📊 实时事件监控
- 播放状态变化
- 时间更新 (每5秒)
- 音量变化
- 全屏切换
- 拖拽尝试检测

## 🔧 技术实现

### 功能禁用方法

#### 进度条禁用
1. **API 禁用**: `progressControl.disable()`
2. **事件重写**: 重写 `handleMouseDown` 和 `handleTouchStart` 方法
3. **样式禁用**: `pointer-events: none` + `cursor: not-allowed`

#### 倍速播放禁用
1. **配置禁用**: `playbackRates: false`
2. **组件隐藏**: `playbackRateMenuButton.hide()`
3. **API 锁定**: 重写 `playbackRate()` 方法锁定为1x

### 📱 移动端兼容性处理

#### 设备检测和自适应配置
- **多平台识别**: iOS/Android/iPad/iPhone 精确检测
- **浏览器适配**: Safari/Chrome/Firefox 特殊处理
- **触摸支持**: 自动检测触摸能力和全屏支持

#### iOS 特殊优化
- **内联播放**: `playsinline` 属性防止强制全屏
- **PiP控制**: 禁用Picture-in-Picture功能
- **Safari兼容**: 处理WebKit全屏API
- **触摸优化**: 禁用callout和默认选择行为

#### Android 兼容性
- **WebView支持**: 兼容各种Android WebView
- **厂商适配**: 华为/小米/三星等定制系统
- **Chrome优化**: 针对Chrome浏览器的特殊处理

#### 性能和网络优化
- **网络感知**: 根据2G/3G/4G调整预加载策略
- **电池优化**: 低电量时启用省电模式
- **内存管理**: 移动端缓冲区限制

详细文档请查看 [MOBILE_COMPATIBILITY.md](./MOBILE_COMPATIBILITY.md)

### 事件监控
- 实时显示所有播放器事件
- 彩色分类显示 (开始/进度/结束/拖拽)
- 自动滚动和日志限制
- 一键清空功能

## 📱 移动端测试

1. 确保设备在同一网络
2. 扫描首页二维码
3. 测试进度条拖拽功能
4. 观察事件日志

## 🎬 MVP 演示要点

1. **展示禁用效果**: 尝试拖拽进度条，观察被阻止的消息
2. **事件实时监控**: 播放视频时观察右侧事件日志
3. **全屏测试**: 进入全屏模式确认拖拽仍被禁用
4. **移动端验证**: 使用手机测试触摸交互

## 🌐 网络信息

服务器会自动检测本机IP地址：
- 本地访问: http://localhost:5173/
- 网络访问: http://[您的IP]:5173/

## 📋 项目结构

```
video-mvp/
├── public/
│   └── h5-video.html    # 视频播放页面
├── index.html           # 主页 (二维码)
├── main.js              # 二维码生成
├── vite.config.js       # Vite 配置
└── package.json         # 项目配置
```
