import React from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/NotFound.css'

const NotFound = () => {
  const navigate = useNavigate()

  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <div className="notfound-wrapper">
      <div className="notfound-container">
        <div className="notfound-error">404</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          Sorry, the page you are looking for does not exist. 
          It might have been moved or deleted.
        </p>
        <Button 
          type="primary" 
          size="large" 
          className="notfound-btn"
          icon={<HomeOutlined />}
          onClick={handleBackHome}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default NotFound

