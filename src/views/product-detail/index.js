import React from 'react'
import ProductDetail from '../../components/ProductDetail'
import Topbar from '../../components/Topbar'
import Navbar from '../../components/Navbar'
import About from '../../components/About'
import Commit from '../../components/Commit'
import Bottom from '../../components/Bottom'
import './index.css'
export default function index() {
    return (
        <div>
        <Topbar />
        <Navbar />
        <div className="myContainer">   
            <ProductDetail />
        </div>
        <About />
        <Commit />
        <Bottom />
    </div>
    )
}
