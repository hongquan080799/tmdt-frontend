import React from 'react'
import ViewAccount from '../../components/ViewAccount'
import Topbar from '../../components/Topbar'
import Navbar from '../../components/Navbar'
import About from '../../components/About'
import Commit from '../../components/Commit'
import Bottom from '../../components/Bottom'
export default function index() {
    return (
        <div>
            <Topbar />
            <Navbar />
            <div className="mt-4">   
                <ViewAccount />
                <About />
                <Commit />
                <Bottom />
            </div>
            
        </div>
    )
}
