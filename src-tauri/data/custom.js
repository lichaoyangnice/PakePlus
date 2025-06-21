// 在PakePlus的「脚本文件」配置区粘贴以下代码
document.addEventListener('DOMContentLoaded', () => {
  // 1. 强制锁定目标UA（Chrome 99）
  const targetUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.157 Safari/537.36";
  Object.defineProperty(navigator, 'userAgent', {
    value: targetUA,
    configurable: false,
    writable: false
  });

  // 2. 补全Chrome环境特征
  if (!window.chrome) {
    window.chrome = {
      runtime: {
        sendMessage: () => {},
        onMessage: { addListener: () => {} }
      },
      tabs: { query: () => {} },
      csi: () => ({}) // 模拟内部计时API
    };
  }

  // 3. 模拟关键插件（欺骗插件检测）
  Object.defineProperty(navigator, 'plugins', {
    value: [{
      name: 'Chrome PDF Viewer',
      filename: 'internal-pdf-viewer',
      description: 'Portable Document Format'
    }],
    configurable: false
  });

  // 4. 控制台验证输出
  console.log("[DEBUG] UA已强制生效:", navigator.userAgent);
  // 在上述脚本末尾追加
// 1. 覆盖WebGL指纹（防止GPU渲染器暴露真实内核）
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
if (gl) {
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  if (ext) {
    const originalGetter = Object.getOwnPropertyDescriptor(WebGLRenderingContext.prototype, 'getParameter');
    Object.defineProperty(WebGLRenderingContext.prototype, 'getParameter', {
      value: function(parameter) {
        if (parameter === ext.UNMASKED_RENDERER_WEBGL) {
          return 'Google SwiftShader'; // 伪装为Chrome渲染器
        }
        return originalGetter.value.call(this, parameter);
      },
      configurable: true
    });
  }
}

// 2. 屏蔽Permission API检测
if (navigator.permissions) {
  navigator.permissions.query = () => Promise.resolve({ state: 'granted' });
}

// 3. 修复文件上传权限
Object.defineProperty(HTMLInputElement.prototype, 'webkitdirectory', {
  set: () => {} // 禁用非常规权限检测
});
});