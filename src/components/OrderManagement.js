import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as donhangApi from '../api/DonhangApi'
import axios from 'axios'
export default function OrderMangement({search}) {
  const [listDonhang, setListDonhang] = useState([])
  const [status, setStatus] = useState(5)
  const checkSearch = (dh)=>{
    if(dh?.madh?.toLowerCase().includes(search.toLowerCase())
    || (dh?.nhanvien?.ho + ' ' + dh?.nhanvien?.ten).toLowerCase().includes(search.toLowerCase())
    || (dh?.khachhang?.ho + ' ' + dh?.khachhang?.ten).toLowerCase().includes(search.toLowerCase())
    )
      return true
    return false
  }
  const [sort, setSort] = useState({
    sortType : 'asc',
    sortField : 'id'
  })
  useEffect(async()=>{
    try {
      const data = await donhangApi.getListOrder();
      setListDonhang(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  },[])
  const huyGHN = async (madh)=>{
    const myHeader = {
      headers:{
          token:"382632fb-ba14-11eb-8546-ca480ac3485e",
          shop_id:80020
      }
    }
    axios.post("https://dev-online-gateway.ghn.vn/shiip/public-api/v2/switch-status/cancel",{order_codes:[madh]},myHeader)
  }
  const handleStausChange = async(madh, trangthai, madhGhn)=>{
      if(window.confirm('Do your really want to change order status ?')){
        try {
          const res = await donhangApi.updateStatus({madh, trangthai})
          if(trangthai == 4){
            huyGHN(madhGhn)
          }
          const data = await donhangApi.getListOrder();
          setListDonhang(data)
        } catch (error) {
          alert('Change status failed !!!');
        }
      }
  }
  const handleChangeStatus = async(e)=>{
    const myStatus = e.target.value
    let data = await donhangApi.getListOrder();
    if(myStatus != 5){
        data = data.filter(d => d?.trangthai == myStatus)
    }
    setListDonhang(data)
  }
  const handleSort = async(e)=>{
    const {name, value} = e.target
    const mySort = {
      ...sort,
      [name]:value
    }
    setSort(mySort)
    const data = await donhangApi.getListOrderBySort(mySort.sortField, mySort.sortType)
    setListDonhang(data)
    console.log(mySort)
  }
    return (
        <div className="tourmn">
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Order List
              </p>
              <div className="d-flex justify-content-around" style={{width:'60%'}}>
                  <select className="custom-select my-1 mr-sm-2 " style={{width:300}} name="sortField" onChange={handleSort}>
                    <option selected value={'madh'}>Sort Field</option>
                    <option value={'madh'}>Order ID</option>
                    <option value={'trangthai'}>Status</option>
                    <option value={'tongtien'}>Total</option>
                    <option value={'ngaydat'}>Date</option>
                  </select>
                  <select className="custom-select my-1 mr-sm-2" style={{width:300}}  name="sortType" onChange={handleSort}>
                    <option selected value={'asc'}>Sort Type</option>
                    <option value={'asc'}>Ascending</option>
                    <option value={'desc'}>Descending</option>
                  </select>
                  <select className="custom-select my-1 mr-sm-2" style={{width:300}} onChange={handleChangeStatus}>
                    <option selected value={5}>Choose status of order</option>
                    <option value={0}>Waiting</option>
                    <option value={1}>Confirmed</option>
                    <option value={2}>Delivering</option>
                    <option value={3}>Delivered</option>
                    <option value={4}>Cancel</option>
                    <option value={5}>All</option>
                  </select>
              </div>
            </div>
            <div className="tourmn__table mt-2">
                <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Order ID</th>
                      <th scope="col">Type of payment</th>
                      <th scope="col">Status</th>
                      <th scope="col">Employee</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Total</th>
                      <th scope="col">Date</th>
                      <th scope="col">View detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listDonhang?.map(dh =>{
                      const type = ()=>{
                        if(dh?.hinhthucthanhtoan == 1)
                          return 'Cash'
                        else if(dh?.hinhthucthanhtoan == 0)
                          return 'Online'
                        else 
                          return 'Else'
                      }
                      let tt = '';
                        if(dh.trangthai == 4)
                          tt = 'Canceled'
                        else if(dh.trangthai == 3)
                          tt = 'Delivered'
                      if(checkSearch(dh))
                      return(
                        <tr>
                          <td>{dh?.madh}</td>
                          <td>{type()}</td>
                          <td>
                          {tt == ''?
                            <select className="custom-select w-75" defaultValue={dh.trangthai} onChange={(e)=> handleStausChange(dh?.madh, e.target.value, dh?.madhGhn)} >
                                {dh.trangthai == 0 ?<option value={0}>Waiting handle</option>:''}
                                {dh.trangthai == 0 || dh.trangthai == 1 ?<option value={1}>Confirmed</option>:''} 
                                {dh.trangthai == 0 || dh.trangthai == 1 || dh.trangthai ==2 ?<option value={2}>Delivering</option>:''} 
                                <option value={3}>Delivered</option>
                                <option value={4}>Cancel</option>
                                  
                            </select>:
                            <p className='text-secondary' style={{fontSize:18,fontStyle:'italic'}}>{tt}</p>
                            
                          }
                          </td>
                          <td>{dh?.nhanvien != null?dh?.nhanvien?.ho + ' ' + dh?.nhanvien?.ten:'Empty'}</td>
                          <td>{dh?.khachhang?.ho + ' ' + dh?.khachhang?.ten}</td>
                          <td>{dh?.tongtien} $</td>
                          <td>{dh?.ngaydat} $</td>
                          <td style={{width:'15rem'}}><button className ="btn btn-info" data-target={'#' + dh?.madh} data-toggle="modal">View</button></td>
                          <div className="modal fade" id={dh?.madh} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-xl" role="document">
                                <div className="modal-content">
                                  <div className="modal-header bg-info text-white">
                                    <h5 className="modal-title" id="exampleModalLabel">List Order Detail</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th scope="col">Product ID</th>
                                          <th scope="col">Product Name</th>
                                          <th scope="col">Price</th>
                                          <th scope="col">Number</th>
                                          <th scope="col">Photo</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {dh?.listCTDH?.map(ct =>{
                                          return (
                                            <tr>
                                              <td>{ct?.sanpham?.masp}</td>
                                              <td>{ct?.sanpham?.tensp}</td>
                                              <td>{ct?.gia}</td>
                                              <td>{ct?.soluong}</td>
                                              <td><img alt="pc" src={ct?.sanpham?.listHA[0]?.photo} style={{width:"100px"}} /></td>
                                            </tr>
                                          )
                                        })}
                                      </tbody>
                                    </table>
                                    </div>
                                    
                                  </div>
                                  <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                </div>
                
              </div>  
            </div>
        </div>
    )
}
