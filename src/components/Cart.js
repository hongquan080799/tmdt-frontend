import React,{useEffect,useContext,useState} from 'react'
import './Cart.css'
import { UserContext } from '../context/UserContext'
import * as ghnApi from '../api/GhnApi'
import * as cartApi from '../api/GiohangApi'
import * as userApi from '../api/UserApi'
import * as donhangApi from '../api/DonhangApi'
import * as emailUtils from '../utils/SendEmail'
import * as paypalUtils from '../utils/PaypalUtils'
import { getSignature } from '../utils/Algorithm'
import Paypal from './Paypal'
import {useHistory} from 'react-router-dom'
export default function Cart() {
    const history = useHistory();
    const [state, setState] = useContext(UserContext)
    const [carts, setCarts] = useState([])
    const [order, setOrder] = useState()
    const [addAddress, setAddAddress] = useState(false)
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [address, setAddress] = useState({})
    const [idAddress, setIdAddress] = useState({})
    const [thanhtoan,setThanhtoan] = useState(0)
    const [voucher, setVoucher] = useState()
    const [discount, setDiscount] = useState(0)
    const [checkout,setCheckout] = useState(false);
    const getUserInfo = async ()=>{
        try {
            const user = await userApi.getUser()
            await setState({...state, user})
        } catch (error) {
            console.log(error)
        }
    }
    useEffect( async ()=>{
        const jwt = await window.localStorage.getItem("jwt")
        if(jwt == null){
            history.push('/login')
        }
        else{
            try {

                try {
                    const province = await ghnApi.getProvince();
                    setProvinces(province.data)

                  } catch (error) {
                      console.log(error)
                  }


              
                const data = await cartApi.getGioHangByMakh()
                console.log(data)
                await setCarts(data)

                const listSP = data.map( value =>{
                    return{
                        masp:value.sanpham.masp,
                        tensp:value.sanpham.tensp,
                        photo:value.sanpham.listHA[0]?.photo,
                        gia:value.sanpham.dongia,
                        soluong:value.soluong,
                        khuyenmai:value.sanpham?.khuyenmai,
                        soluongSP:value.sanpham.soluong,
                        danhmuc:value.sanpham?.danhmuc,
                        isCheck:true
                    }
                })
                setOrder({
                    ...order,
                    listSP
                })

            } catch (error) {
                console.log(error)
            }
        }
    },[])
    const handleInputChange = async(e, masp)=>{
        let {value, name} = e.target;
        let listSp = order.listSP
        for(let i in listSp){
            if(listSp[i].masp === masp){
                if(name === 'isCheck'){
                    value = !listSp[i].isCheck
                    //return
                }
                if(name === 'soluong' && value > listSp[i].soluongSP)
                    return
                else{
                    listSp[i] = {
                        ...listSp[i],
                        [name]:value
                    }
                    //update num in db
                    try {
                       const response =  await cartApi.updateCart({masp:listSp[i].masp, makh: 0 ,soluong:listSp[i].soluong})

                       const numCart = await cartApi.getNumCart()
                       setState({...state, numCart})
                    } catch (error) {
                        console.log(error)
                        alert('Some error is happened')
                    }
                }
            }
        }
        console.log(listSp)
        setOrder({
            ...order,
            listSP:listSp
        })
    }
    const getPrice = ()=>{

        let price = 0;
        order?.listSP?.forEach(sp =>{
            if(sp.isCheck)
            price += sp.soluong * sp.gia - sp.soluong * sp.gia * sp.khuyenmai
        })
        return price - price * discount
    }
    const deleteCart = async (masp)=>{
        try {
            const res = await cartApi.deleteCart(masp)
            window.location.reload()
        } catch (error) {
            console.log(error)
            alert('Delete cart failed !!!')            
            
        }
    }
    const getShipAddress = ()=>{
        if(state?.user?.listDC != null){
            for(let i = 0 ; i< state?.user?.listDC?.length ; i++){
                if(state?.user?.listDC[i]?.isShipAddress){
                    const shipAdd = state?.user?.listDC[i]
                  return shipAdd.addressDetail + ', ' + shipAdd.wardName + ', ' + shipAdd.districtName + ', ' + shipAdd.provinceName
              }
            }
        }
        else{
            return <p className="text-info shipTo__change">Add shiping address</p>
        }
    }

    const getShipAddressToGHN = ()=>{
        if(state?.user?.listDC != null){
            for(let i = 0 ; i< state?.user?.listDC?.length ; i++){
                if(state?.user?.listDC[i]?.isShipAddress){
                    const shipAdd = state?.user?.listDC[i]
                  return {
                      district:shipAdd?.districtId,
                      ward:shipAdd?.wardCode,
                      address:shipAdd?.addressDetail
                  }
              }
            }
        }
    }

    const checkOrder = ()=>{
        if(state?.user != null){
        const value = state?.user
            if(value?.listDC == null)
                return false
            else if(value?.sdt == null)
                return false
            else if(value?.email == null)
                return false
            else if(!order?.listSP[0]?.isCheck)
                return false
            else
                return true

        }
        else
            return false
    }

    const loadDistrict = async (provinceID)=>{
        try {
            const district = await ghnApi.getDistrict(provinceID)
            setDistricts(district.data)
            
          } catch (error) {
              throw error
            }
        }
  
      const loadWard = async (districtID)=>{
          try {
              const ward = await ghnApi.getWard(districtID)
              setWards(ward.data)
          } catch (error) {
              throw error
          }
      }
    const handleAddressChange = (e)=>{
        const {name, value} = e.target;
          if(name === 'province'){
              loadDistrict(Number(value))
              const province = provinces?.filter(pv => pv.ProvinceID == value)[0]
              setAddress({
                ...address,
                provinceId:province?.ProvinceID,
                provinceName:province?.ProvinceName,
              })
              return;
          }
          if(name === 'district'){
              loadWard(Number(value))
              const district = districts?.filter(pv => pv.DistrictID == value)[0]
              setAddress({
                  ...address,
                  districtId:district?.DistrictID,
                  districtName:district?.DistrictName,
              })
              return
          }
          if(name === 'ward'){
              const ward = wards?.filter(pv => pv.WardCode == value)[0]
              setAddress({
                ...address,
                wardCode:ward?.WardCode,
                wardName:ward?.WardName,
              })
              return
          }
          if(name === 'addressDetail'){
              setAddress({
                  ...address,
                  addressDetail:value
              })
              return
          }
      }
      const handleAddAddress = async ()=>{
          console.log(address)
          if(address.provinceId == null || address.districtId == null || address.wardCode == null || address.addressDetail == null){
              alert('Fill all the input !!!')
              return
          }
          else{
              try {
                  const response = await userApi.addShipAddress(address)
                  getUserInfo()
                  setAddress({})
                  setAddAddress(false)
              } catch (error) {
                  alert('Add address failed !!!')
              }
          }
      }
      const handleSubmitSelectAddress = async ()=>{
          try {
              const response = await userApi.setShipAddress(idAddress)
              getUserInfo()
          } catch (error) {
              console.log(error)
              alert('Change address failed !!!')
          }
      }
      const handledeleteShipAddress = async (id)=>{
        try {
            const response = await userApi.deleteShipAddress(id)
            getUserInfo()
        } catch (error) {
            console.log(error)
            alert('Delete address failed !!!')
        }
    }
    const paymentStatus = (status)=>{
        setCheckout(status);
        if(status)
        alert('Payment successfully')
        else
        alert('Payment failed !')
    }
    const handleSubmitOrder = async ()=>{
        const customsProduct = order?.listSP?.map(sp =>{
            if(sp.isCheck)
            return {
                masp:sp.masp,
                tensp:sp.tensp,
                soluong:sp.soluong,
                dongia:sp.gia - sp.gia * sp.khuyenmai,
            }
        })
        let customOrder = {
            listSP:customsProduct,
            httt:Number(thanhtoan),
            diachi:getShipAddress(),
        }
        
        if(discount > 0 )
            customOrder.voucherId = voucher
        if(thanhtoan == 1){
            const res = await paypalUtils.getPayPalLinl(customOrder, getPrice());
            window.location.href = res;
            return
        }
        if(thanhtoan == 2){
            const orderId = 'DH' + new Date().getTime()
            const res = await getSignature(customOrder, getPrice(), orderId)
            window.location.href = res.payUrl;
            return
            
        }
        try {

            const ghnResponse = await ghnApi.getOrderGHN(order, state?.user, getShipAddressToGHN(), getPrice())
            customOrder.madhGhn = ghnResponse?.data?.order_code
            await donhangApi.order(customOrder)
            alert('Order successfully !!!')
            const myMessage = emailUtils.getMessageOrder(state?.user, order?.listSP, getShipAddress)

            emailUtils.sendEmail(myMessage, state?.user)
            

        } catch (error) {
            alert('Order failed !!! ' + error.data.message)
            console.log(error)
        }
    }
    const checkVoucher = async()=>{
        try {
            const res = await donhangApi.checkVoucher(voucher)
            setDiscount(res.discount)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="shoppingCart">
            <h4 className="shoppingCart__head">SHOPPING CART <i class="fas fa-shopping-cart"></i></h4>
            <hr />
            <div className="row">
                <div className="shoppingCart__itemList col-8">
                    <div className="table-responsive">
                    <h4 className="cart-header">CART LIST</h4>     
                    <table className="table table-border table-cart">
                            {/* {cart.map(c=>(
                                <tr key={c.sanpham.masp}>
                                    <td onClick={()=> deleteCart(c.sanpham.masp)} className="deleteCart">&#10005;</td>
                                    <td><img src={c.sanpham.photo} alt="picture" style={{width:"70px",marginRight:"30px"}} /> {c.sanpham.tensp}</td>
                                    <td style={{width:"15%"}}><input type="number" className="form-control" min="1" max={c.sanpham.soluong} defaultValue={c.soluong} onClick={(e)=>changeNum(e,c.sanpham)} /></td>
                                    <td><p className="text-danger">{c.sanpham.dongia * c.soluong} $</p></td>
                                    <td><input type="checkbox" className="form-check-input" defaultChecked onClick={(e)=>checkSP(e,c.sanpham,c.soluong)}/></td>
                                </tr>
                            ))} */}
                            {order?.listSP?.map((sanpham, index) =>{
                                return(
                                    <tr key={index} >
                                        <td className="deleteCart" onClick={()=> deleteCart(sanpham?.masp)}>&#10005;</td>
                                        <td><img src={sanpham?.photo} alt="picture" style={{width:"70px",marginRight:"30px"}} /> {sanpham?.tensp}</td>
                                        <td style={{width:"15%"}}><input type="number" onChange={(e) => handleInputChange(e, sanpham.masp)} name="soluong" max={sanpham.soluongSP} value={sanpham?.soluong} className="form-control" min="1" /></td>
                                        <td className="text-danger">{sanpham?.gia * sanpham?.soluong - sanpham?.gia * sanpham?.khuyenmai * sanpham?.soluong} $ <span style={{textDecoration:'line-through', fontSize:'0.9rem'}} className="text-secondary ml-2">{sanpham?.gia * sanpham?.soluong} $</span></td>
                                        <td><input type="checkbox" name="isCheck" onChange={(e) => handleInputChange(e, sanpham.masp)} className="form-check-input" checked={sanpham.isCheck} /></td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                    
                </div>
                
                <div className="shoppingCart__detail col-4">
                    <div className="shoppingCart_detail-address">
                       <div className="shipTo d-flex justify-content-between">
                           <p>Ship to</p>
                           <p className="text-info shipTo__change" data-toggle="modal" data-target="#changeAddress">Change address</p>
                            <div className="modal fade" id="changeAddress" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                                  <div className="modal-content">
                                    <div className="modal-header bg-success text-white">
                                      <h5 className="modal-title" id="exampleModalLabel">UPDATE SHIPPING ADDRESS</h5>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                      </button>
                                    </div>
                                    <div className="modal-body" style ={{minHeight:'50vh', overflow:'scroll'}}>
                                     {!addAddress?
                                        <div className="d-flex justify-content-between">
                                        <h5>List shipping address</h5>
                                        <button className="btn btn-outline-success" onClick = {()=> setAddAddress(true)} >Add more address</button>
                                      </div> :''
                                    }
                                     <div>
                                         
                                        {addAddress?
                                            <div>
                                                <h5>New address</h5>
                                                <div className="d-flex">
                                                    <select className="custom-select my-1 mr-sm-2" name="province" onChange={handleAddressChange}>
                                                        <option>Province</option>
                                                        {provinces?.map(province =>{
                                                            return(
                                                                <option value={province.ProvinceID}>{province.ProvinceName}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    <select className="custom-select my-1 mr-sm-2" name="district" onChange={handleAddressChange}>
                                                        <option>District</option>
                                                        {districts?.map(district =>{
                                                            return(
                                                                <option value={district.DistrictID}>{district.DistrictName}</option>
                                                            )
                                                        })}
                                                    </select>
                                                    <select className="custom-select my-1 mr-sm-2" name="ward" onChange={handleAddressChange}>
                                                        <option>Ward</option>
                                                        {wards?.map(ward =>{
                                                            return(
                                                                <option value={ward.WardCode}>{ward.WardName}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                                <input type="text" name="addressDetail" onChange={handleAddressChange} className="form-control mb-2 mr-sm-2 mt-2" placeholder="Enter your address" />
                                                <button className="btn btn-outline-success mr-2 mt-4 w-25" onClick={handleAddAddress}>Add</button>
                                                <button className="btn btn-danger mt-4 w-25"  onClick={() => setAddAddress(false)}>Cancel</button>
                                            </div>

                                        :
                                        <div>
                                            {state?.user?.listDC.map(dc =>{
                                            return (
                                              <div>
                                                    <hr />
                                                    <div className="d-flex justify-content-between">
                                                        <div className="d-flex">
                                                            {!dc.isHomeAddress?<p className="mr-4 deleteDC" onClick={()=>{handledeleteShipAddress(dc.id)}}>x</p>:<p className="mr-4 notdeleteDC">o</p>}
                                                            <p>{dc.addressDetail + ', ' + dc.wardName + ', ' + dc.districtName + ', ' + dc.provinceName}</p>
                                                        </div>
                                                        <input type="radio" onClick={()=>{setIdAddress(dc.id)}} placeholder="Jane Doe" name="shipAddress" defaultChecked = {dc.isShipAddress} />
                                                    </div>                
                                                </div>
                                            )
                                             })}
                                            </div>
                                        }
                                     </div>
                                      
                            
                                    </div>
                                    <div className="modal-footer">
                                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                      <button type="button" className="btn btn-success" onClick = {handleSubmitSelectAddress}>Save changes</button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                       </div>
                       <div className="userInfo d-flex mt-3">
                           <p className="mr-3">{state?.user?.displayname}</p>
                           <p className="mr-3 text-secondary">|</p>
                           <p>{state?.user?.sdt || <p className="text-info shipTo__change" onClick={()=>history.push('/viewAccount')}>Add phone number</p>}</p>
                       </div>
                       <div className="userAddress">
                           <p className="text-secondary">
                               {getShipAddress()} 
                           </p>
                       </div>
                    </div>
                    <div className="shoppingCart_detail-discount">
                       
                    </div>
                    <div className="shopingCart_detail-totalPrice">
                        <div class="input-group mb-3 mt-2">
                            <input type="text" class="form-control" placeholder="Enter voucher code" onChange={(e)=> setVoucher(e.target.value)} value={voucher}/>
                            <div class="input-group-append">
                                <button onClick={checkVoucher} class="btn btn-info">Apply</button>
                            </div>
                        </div>
                        
                         <div className="d-flex justify-content-between">
                            <p>Discount</p>
                            <p className="text-danger">{discount * 100} %</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p>Temporary price</p>
                            <p className="text-danger">{getPrice()} $</p>
                        </div>
                        <div className="d-flex justify-content-between">
                            <p className="totalPrice">Total Price</p>
                            <p className="text-danger totalPrice">{getPrice()} $</p>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success orderBtn" data-toggle={checkOrder()?'modal':''} data-target="#exampleModal" onClick = {()=> {if(!checkOrder()){alert('Fullfill your profile !') ; return}}}>ORDER NOW</button>
                        </div>

                          <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                  <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">TIẾN HÀNH ĐẶT HÀNG</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                      <p className="text-secondary">Thông tin khách hàng</p>
                                      <hr/>
                                        <table className="table table-borderless table-cart">
                                            <tr>
                                                <td>HỌ TÊN</td>
                                                <td>{state.user?.ho + ' ' + state.user?.ten}</td>
                                            </tr>
                                            <tr>
                                                <td>SỐ ĐIỆN THOẠI</td>
                                                <td>{state.user?.sdt}</td>
                                            </tr>
                                            <tr>
                                                <td>EMAIL</td>
                                                <td>{state.user?.email}</td>
                                            </tr>
                                            <tr>
                                                <td>ĐỊA CHỈ</td>
                                                <td>{getShipAddress()}</td>
                                            </tr>
                                        </table>
                                    <hr/>
                                    <p className="text-secondary">Danh sách sản phẩm</p>
                                    <hr/>
                                    <table className="table table-borderless table-cart">
                                        {order?.listSP?.map(c=>{
                                            return(
                                                <tr key={c.masp}>
                                                    <td><img src={c.photo} alt="picture" style={{width:"70px",marginRight:"30px"}} /> {c.tensp}</td>
                                                    <td style={{width:"15%"}}>Số lượng : {c.soluong}</td>
                                                    <td className="text-danger">{c?.gia * c?.soluong - c?.gia * c?.khuyenmai * c?.soluong} $ <span style={{textDecoration:'line-through', fontSize:'0.9rem'}} className="text-secondary ml-2">{c?.gia * c?.soluong} $</span></td>
                                                </tr>)
                                            }
                                        )}
                                        <hr/>
                                        <tr>
                                            <td colSpan="2" style={{fontSize:"23px"}}>Tổng tiền</td>
                                            <td style={{fontSize:"23px"}}>{getPrice()} $</td>
                                        </tr>
                                        <tr>
                                            <td>Thanh toán</td>
                                            <td colSpan="2"><select className="custom-select my-1 mr-sm-2" onChange={(e)=>setThanhtoan(e.target.value)}>
                                              <option value={0}>Tiền mặt</option>
                                              <option value={1}>Paypal</option>
                                              <option value={2}>Momo</option>
                                            </select></td>
                                        </tr>
                                        {/* {thanhtoan == 1?<tr>
                                            <Paypal paymentStatus={paymentStatus} tongtien = {getPrice()}/>
                                        </tr>:''} */}
                                    </table>

                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={handleSubmitOrder}>Confirm</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
