import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, theme } from 'antd'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#c8a96e',
        colorBgBase: '#0f0f0f',
        colorBgContainer: '#161616',
        borderRadius: 8,
        fontFamily: 'Georgia, serif',
      },
    }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
