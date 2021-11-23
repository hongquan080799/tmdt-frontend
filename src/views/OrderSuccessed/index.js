import React from 'react'
import Topbar from '../../components/Topbar'
import Navbar from '../../components/Navbar'
import Carousel from '../../components/Carousel'
import Banner from '../../components/Banner'
import Items from '../../components/Items'
import About from '../../components/About'
import Commit from '../../components/Commit'
import OrderSuccess from '../../components/OrderSuccess'
import Bottom from '../../components/Bottom'

import './index.css'

export default function index() {
    return (
        <div>
            <Topbar />
            <Navbar />
            <div className="myContainer">   
                <OrderSuccess />
                <About />
                <Commit />
                <Bottom />
            </div>
            
        </div>
    )
}
