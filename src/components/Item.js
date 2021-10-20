import React, {useContext} from 'react'
import {useHistory} from 'react-router-dom'
import './Item.css'
import * as cartApi from '../api/GiohangApi'
import { UserContext } from '../context/UserContext'
export default function Item({product}) {
  const [state, setState] = useContext(UserContext)
  const history = useHistory()
  const addCart = async (masp)=>{
      const data = {
        masp,
        makh:'',
        soluong:1
      }
      if(product?.soluong == 0){
        alert('Product is run out !')
        return
      }
      try {
        const response = await cartApi.insertGioHang(data)
        alert('Add to cart successfully !!!')
        const numCart = await cartApi.getNumCart()
        setState({...state, numCart})

      } catch (error) {
        alert('Add to cart failed')
        console.log(error)
      }
  }
    return (
        <div className='myItem' onDoubleClick={()=> window.location.replace(`/product/${product.masp}`)}>
            <div className="card" style={{width: '18rem'}}>
              <div className="card" style={{width: '18rem'}}>
                <div className="image"><img className="card-img-top" src={product?.listHA[0]?.photo} alt="picture"/></div>
                <div className="card-body my-card-body" >
                  <h5 className="card-title">{product.tensp}</h5>
                  <p className="card-text">{product.mota_ngan}</p>
                  <p className="card-text text-danger">{product.dongia - product.dongia * product.khuyenmai} $ <span className="text-secondary" style={{textDecoration:'line-through'}}>  {product.dongia} $</span></p> 
                  <button className='btn-addCart' onClick={()=> addCart(product.masp)}>THÊM GIỎ HÀNG</button>
                </div>
                
              </div>
             
            </div>
            
        </div>
    )
}
