import React from 'react'
import Topbar from '../../components/Topbar'
import Navbar from '../../components/Navbar'
import About from '../../components/About'
import Commit from '../../components/Commit'
import Bottom from '../../components/Bottom'
import NotificationPage from '../../components/NotificationPage'

export default function index() {
    return (
        <div>
            <Topbar />
            <Navbar />
            <div className="myContainer">   
                <NotificationPage />
                <About />
                <Commit />
                <Bottom />
            </div>
            
        </div>
    )
}
