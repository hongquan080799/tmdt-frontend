import React from 'react'
import Cart from '../../components/Cart'
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
            <div className="myContainer mt-4">   
                <Cart />
            </div>
            <About />
            <Commit />
            <Bottom />
        </div>
    )
}
