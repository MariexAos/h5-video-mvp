import QRCode from 'qrcode'

// 获取本机IP地址的函数
async function getLocalIP() {
  try {
    // 尝试从Vite配置中获取预定义的IP
    if (typeof __LOCAL_IP__ !== 'undefined') {
      return __LOCAL_IP__
    }
    
    // 备用方案：通过WebRTC获取本地IP
    return new Promise((resolve) => {
      const pc = new RTCPeerConnection({
        iceServers: []
      })
      
      pc.createDataChannel('')
      pc.createOffer().then(offer => pc.setLocalDescription(offer))
      
      pc.onicecandidate = (ice) => {
        if (ice && ice.candidate && ice.candidate.candidate) {
          const candidate = ice.candidate.candidate
          const match = candidate.match(/(\d+\.\d+\.\d+\.\d+)/)
          if (match) {
            pc.close()
            resolve(match[1])
            return
          }
        }
      }
      
      // 超时处理
      setTimeout(() => {
        pc.close()
        resolve('localhost')
      }, 3000)
    })
  } catch (error) {
    console.warn('无法获取本地IP，使用localhost', error)
    return 'localhost'
  }
}

// 生成二维码
async function generateQRCode() {
  const qrContainer = document.getElementById('qrcode')
  const urlDisplay = document.getElementById('url-display')
  const networkDetails = document.getElementById('network-details')
  
  try {
    // 显示加载状态
    qrContainer.innerHTML = '<div class="loading"></div>'
    urlDisplay.textContent = '正在生成访问链接...'
    
    // 获取本地IP
    const localIP = await getLocalIP()
    const port = window.location.port || '5173'
    const protocol = window.location.protocol
    
    // 构建URL
    const baseUrl = `${protocol}//${localIP}:${port}`
    const videoUrl = `${baseUrl}/h5-video.html`
    
    // 更新网络信息显示
    networkDetails.innerHTML = `
      <strong>服务器地址:</strong> ${baseUrl}<br>
      <strong>视频页面:</strong> /h5-video.html<br>
      <strong>本地IP:</strong> ${localIP}<br>
      <strong>端口:</strong> ${port}
    `
    
    // 生成二维码
    const canvas = await QRCode.toCanvas(videoUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#333333',
        light: '#FFFFFF'
      }
    })
    
    // 清空容器并添加二维码
    qrContainer.innerHTML = ''
    qrContainer.appendChild(canvas)
    
    // 显示URL
    urlDisplay.textContent = videoUrl
    
    // 存储URL供复制使用
    window.currentVideoUrl = videoUrl
    
    return videoUrl
  } catch (error) {
    console.error('生成二维码失败:', error)
    qrContainer.innerHTML = '<p style="color: red;">二维码生成失败</p>'
    urlDisplay.textContent = '生成失败，请检查网络连接'
  }
}

// 复制链接到剪贴板
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // 备用方案
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
      textArea.remove()
      return true
    } catch (err) {
      textArea.remove()
      return false
    }
  }
}

// 显示提示消息
function showToast(message, type = 'success') {
  // 移除已存在的提示
  const existingToast = document.querySelector('.toast')
  if (existingToast) {
    existingToast.remove()
  }
  
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 1000;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
  `
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateX(0)'
  }, 100)
  
  // 3秒后隐藏
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove()
      }
    }, 300)
  }, 3000)
}

// 检测设备类型
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 初始化应用
async function initApp() {
  console.log('📱 Video MVP 初始化开始...')
  
  // 如果是移动设备访问首页，自动跳转到视频页面
  if (isMobile() && window.location.pathname === '/') {
    console.log('📱 检测到移动设备，跳转到视频页面...')
    window.location.href = '/h5-video.html'
    return
  }
  
  // 生成二维码
  await generateQRCode()
  
  // 绑定事件监听器
  const copyBtn = document.getElementById('copyBtn')
  const refreshBtn = document.getElementById('refreshBtn')
  
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      if (window.currentVideoUrl) {
        const success = await copyToClipboard(window.currentVideoUrl)
        if (success) {
          showToast('链接已复制到剪贴板！', 'success')
        } else {
          showToast('复制失败，请手动复制', 'error')
        }
      }
    })
  }
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      generateQRCode()
      showToast('二维码已刷新', 'success')
    })
  }
  
  // 监听网络状态变化
  window.addEventListener('online', () => {
    showToast('网络连接已恢复', 'success')
    generateQRCode()
  })
  
  window.addEventListener('offline', () => {
    showToast('网络连接已断开', 'error')
  })
  
  console.log('✅ Video MVP 初始化完成')
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}

// 导出函数供调试使用
window.videoMVP = {
  generateQRCode,
  copyToClipboard,
  getLocalIP,
  isMobile
}
