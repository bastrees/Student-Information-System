import React from 'react'
import Sidebar from './Sidebar'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className='dashboard'>
    <Sidebar />
        <h1>Welcome to Saint Mary's University!</h1>
    </div>
  )
}

export default Dashboard