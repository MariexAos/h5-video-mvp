import { defineConfig } from 'vite'
import { networkInterfaces } from 'os'

// 获取本机IP地址
function getLocalIP() {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 跳过IPv6和内部地址
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return 'localhost'
}

export default defineConfig({
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 5173,
    open: true
  },
  // 静态资源配置
  publicDir: 'public',
  define: {
    __LOCAL_IP__: JSON.stringify(getLocalIP())
  }
})
