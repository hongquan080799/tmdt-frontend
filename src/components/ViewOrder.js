import React, {useEffect, useContext, useState} from 'react'
import './ViewOrder.css'
import { UserContext } from '../context/UserContext'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import * as donhangApi from '../api/DonhangApi'

const ViewOrder = ()=>{
    const [donhang,setDonhang] = useState([])
    const history = useHistory()
    const [find, setFind] = useState('')
    const [state, setState] = useContext(UserContext)
    useEffect(async()=>{
        if(state?.user != null)
        {
            try {
              const response = await donhangApi.getListOrderByKhachhang()
              console.log(response)
              setDonhang(response)
            } catch (error) {
              console.log(error)
            }
        }
        else{
            //history.push("/")
        }
    },[state])
    
    const getTinhtrang = (tt)=>{
        if(tt === 4)
          return 'Cancel'
        else if(tt === 0)
          return 'Waiting'
        else if( tt === 1)
          return 'Confirm'
        else if(tt === 2)
          return 'Delivering'
        else if(tt === 3)
          return 'Delivered'
      }
      const huyDon= async(madh, madhGhn)=>{
        const kq = window.confirm('Do you want to cancel this order ?')
        if(kq){
          try {
            const res = await donhangApi.updateStatus({madh, trangthai:4});
            huyGHN(madhGhn);
            alert('Order have been canceled successfully !')
          } catch (error) {
            alert('Cancel failed !');
          }
        }
      }
      const huyGHN = async (madh)=>{
        const myHeader = {
          headers:{
              token:"382632fb-ba14-11eb-8546-ca480ac3485e",
              shop_id:80020
          }
        }
        axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel",{order_codes:[madh]},myHeader)
        .then(res =>{
          window.location.reload();
        })
        .catch(err=> console.log(err))
      }
      const handleChangeStatus = async(myStatus)=>{
        const response = await donhangApi.getListOrder()
        if(myStatus != 5){ 
          const list = response.filter(dh => dh?.trangthai  == myStatus)
          setDonhang(list)
        }
        else{
          setDonhang(response)
        }
      }
      const getPayment = (httt)=>{
        if(httt == 0)
          return 'Cash'
        else if(httt == 1)
          return 'Paypal'
        else if(httt == 2)
          return 'Momo'
      }
    return (
       <div className="container view-container">
           <div className="card view-order">
                <div className="card-header text-white bg-success d-flex justify-content-between px-4">ORDER INFORMATION</div>
                <div className="card-body">
                <ul class="nav nav-tabs">
                  <li class="nav-item" style={{width:'16%'}}>
                    <a class="nav-link active" data-toggle="tab" href="#all" onClick={()=>handleChangeStatus(5)}>All</a>
                  </li>
                  <li class="nav-item" style={{width:'16%'}}>
                    <a class="nav-link" data-toggle="tab" href="#waiting" onClick={()=>handleChangeStatus(0)}>Waiting</a>
                  </li>
                  <li class="nav-item" style={{width:'16%'}}>
                    <a class="nav-link" data-toggle="tab" href="#confirm" onClick={()=>handleChangeStatus(1)}>Confirm</a>
                  </li>
                  <li class="nav-item" style={{width:'16%'}}>
                    <a class="nav-link" data-toggle="tab" href="#delivering" onClick={()=>handleChangeStatus(2)}>Delivering</a>
                  </li>
                  <li class="nav-item" style={{width:'16%'}}>
                    <a class="nav-link" data-toggle="tab" href="#deleverd" onClick={()=>handleChangeStatus(3)}>Delivered</a>
                  </li>
                  <li class="nav-item" style={{width:'16%'}} onClick={()=>handleChangeStatus(4)}>
                    <a class="nav-link" data-toggle="tab" href="#cancel">Cancel</a>
                  </li>
                </ul>
                
                  <div class="input-group mb-3 mt-4" style={{width:'100%',margin:'auto'}}>
                      <input type="text" class="form-control" placeholder="Find order" onChange={(e)=> setFind(e.target.value)}/>
                      <div class="input-group-append">
                          <button class="btn btn-info" type="submit"><i className="fa fa-search" aria-hidden="true"></i></button>
                      </div>
                    </div>
                    {donhang?.map(dh=>{
                    if(dh?.madh.toLowerCase().includes(find.toLowerCase()) || dh?.listCTDH.some(c => c?.sanpham?.tensp?.toLowerCase().includes(find.toLowerCase())))
                    return (
                        <div style={{width:'100%',marginTop:40, color:'#545454'}}>
                          <h5 className="mb-2">OrderID : {dh?.madh}</h5>
                          <h6>Date: {dh?.ngaydat}</h6>
                          <h6>Total price : {dh?.tongtien} $</h6>
                          <h6>Type of payment : {getPayment(dh?.hinhthucthanhtoan)}</h6>
                          <h6>Status of order: {getTinhtrang(dh?.trangthai)}</h6>
                          {dh?.trangthai==0?<button className="btn btn-outline-danger mt-3" type="button" onClick={()=>huyDon(dh?.madh, dh?.madhGhn)}>Cancel</button>:''}
                          <h5 className="mt-4">List of product</h5>
                          <div className="table-responsive">
                          <table className="table table-borderless table-hover" style={{fontSize:19}} >
                            <tbody>
                              {dh?.listCTDH?.map(ct=>(
                                <div>
                                  <hr/>
                                  <tr>
                                    <td style={{color:'#868688'}}>Product ID</td>
                                    <td>{ct.sanpham?.masp}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Product Name</td>
                                    <td>{ct.sanpham?.tensp}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Number</td>
                                    <td>{ct.soluong}</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Price</td>
                                    <td>{ct.sanpham?.dongia} $</td>
                                  </tr>
                                  <tr>
                                    <td style={{color:'#868688'}}>Photo</td>
                                    <td ><img src={ct.sanpham?.listHA[0].photo} alt="pt" style={{width:150}}/></td>
                                  </tr>
                                </div>
                              ))}
                            </tbody>
                          </table>
                          </div>
                          
                          <hr></hr>

                        </div>
                    )
                })} 
                  
                 
                
                <hr/>
                
                </div>
            </div>  
       </div>
    )
}

export default ViewOrder