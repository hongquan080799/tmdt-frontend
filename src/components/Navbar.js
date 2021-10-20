import React,{useEffect, useState} from 'react'
import './Navbar.css'
import logo from '../image/logo.png'
import {Link} from 'react-router-dom'
import * as danhmucApi from '../api/DanhmucApi'
import * as sanphamApi from '../api/SanphamApi'
export default function Navbar() {
  const [danhmuc, setDanhmuc] = useState([])
  const [products, setProducts] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [search, setSearch] = useState('')
  useEffect( async()=>{
    try {
      const data = await danhmucApi.getDanhmuc();
      setDanhmuc(data)
      const listSP = await sanphamApi.getListSanpham()
      setProducts(listSP)
    } catch (error) {
      console.log(error)
    }
    
  },[])
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
         <a className="navbar-brand d-block d-sm-none" to="/#">
            <img src={logo} className='logo'/>
         </a>
         <Link to='/'>
          <a className="navbar-brand d-none d-sm-block" to="/#">
              <img src="https://img.icons8.com/fluent/96/000000/hummingbird.png" style={{width:50}} className='logo'/>
              <span style={{fontSize:20,color:'#005a18'}}>ANGRY BIRD</span>
          </a>
         </Link>
        <form className='search input-group ' onFocus={()=>setIsSearch(true)} onBlur={()=>setIsSearch(false)}>
            <input className='form-control' placeholder='Nhập để tìm kiếm . . .'  onChange={(e)=> setSearch(e.target.value)}/>
            <div className="input-group-append">
                <button className='btn btn-success'><i className="fa fa-search" aria-hidden="true"></i></button>
            </div>
            {isSearch?
              <div className="searchBox">
              <div className="table-responsive">
              <table className="table table-borderless table-hover table-dark" >
                <tbody>
                  {products.map(sp=>{
                    if(sp.tensp.toLowerCase().includes(search.toLowerCase()))
                    return (
                      <tr key={sp.masp} onMouseDown={()=> window.location.href="/product/"+sp.masp}  >
                          <td>{sp.tensp}</td>
                          <td><img alt="pr" src={sp.listHA[0]?.photo} style={{width:70}}/></td>
                          <td>{sp.dongia}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>
              
            </div>:''
            }
        </form>
         <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
           <span className="navbar-toggler-icon" />
               </button>
               <div className="collapse navbar-collapse" id="navbarText">
                 <ul className="navbar-nav ml-auto">
                   <li className="nav-item">
                     <a className='nav-link'>TRANG CHỦ</a>
                   </li>
                   <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">DANH MỤC</a>
                            <div className="dropdown-menu">
                                 {danhmuc?.map(dm=>{
                                   return (
                                    <p className="dropdown-item" onClick={()=> window.location.replace(`/danhmuc/${dm?.madm}`)}>{dm?.tendm}</p>
                                   )
                                 })}
                            </div>
                   </li>
                   <li className="nav-item">
                     <a className='nav-link'>LIÊN HỆ</a>
                   </li>
                   <li className="nav-item">
                     <a className='nav-link'>TÌM HIỂU</a>
                   </li>
                 </ul>
                 
               </div>
               
               
             </nav>
    )
}
