import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as khachhangApi from '../api/KhachhangApi'
export default function KhachhangManagement({search}) {
  const [listKhachhang, setListKhachhang] = useState([])
  const checkSearch = (kh)=>{
    if((kh?.ho + ' ' + kh?.ten)?.toLowerCase().includes(search.toLowerCase()) 
    || kh?.username?.toLowerCase().includes(search.toLowerCase())
    || kh?.email?.toLowerCase().includes(search.toLowerCase())
    || kh?.sdt?.toLowerCase().includes(search.toLowerCase())
    )
      return true
    return false;
  }
  const [sort, setSort] = useState({
    sortType : 'asc',
    sortField : 'id'
  })
  useEffect(async()=>{
    try {
      const data = await khachhangApi.getListKH()
      setListKhachhang(data)
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  },[])
  const deleteKhachhang = async(username)=>{
    if(window.confirm('Do you want to delete customer : ' + username + " ?")){
      try {
        const response = await khachhangApi.deleteKhachhang(username)
        alert("Delete customer successfully !!!")
        const data = await khachhangApi.getListKH()
        setListKhachhang(data)
      } catch (error) {
        console.log(error)
        alert("Delete customer failed !!!")
      }
    }
  }
  const getHomeAddress = (kh)=>{
    console.log(kh?.listDC)
    if(kh?.listDC != null){
        for(let i = 0 ; i< kh?.listDC?.length ; i++){
            if(kh?.listDC[i]?.isHomeAddress){
              return kh?.listDC[i]?.addressDetail + ', ' + kh?.listDC[i]?.wardName + ', ' + kh?.listDC[i]?.districtName + ', ' + kh?.listDC[i]?.provinceName
          }
        }
    }
    return "Don't have address yet !";
    }
    const handleSort = async(e)=>{
      const {name, value} = e.target
      const mySort = {
        ...sort,
        [name]:value
      }
      setSort(mySort)
      const data = await khachhangApi.getListKHWithSort(mySort.sortField, mySort.sortType)
      setListKhachhang(data)
      console.log(mySort)
    }
    return (
        <div className="tourmn">
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Customer List
              </p>
              <div className="d-flex justify-content-around" style={{width:'40%'}}>
                  <select className="custom-select my-1 mr-sm-2 " style={{width:300}} name="sortField" onChange={handleSort}>
                    <option selected value={'id'}>Sort field</option>
                    <option value={'id'}>Customer ID</option>
                    <option value={'ten'}>First Name</option>
                    <option value={'username'}>Username</option>
                    <option value={'email'}>Email</option>
                  </select>
                  <select className="custom-select my-1 mr-sm-2" style={{width:300}}  name="sortType" onChange={handleSort}>
                    <option selected value={'asc'}>Sort Type</option>
                    <option value={'asc'}>Ascending</option>
                    <option value={'desc'}>Descending</option>
                  </select>
              </div>
            </div>
            <div className="tourmn__table mt-2">
                <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">First name</th>
                      <th scope="col">Last name</th>
                      <th scope="col">Username</th>
                      <th scope="col">Email</th>
                      <th scope="col">Phone number</th>
                      <th scope="col">Gender</th>
                      <th scope="col">View More</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listKhachhang?.map(kh =>{
                      const gioitinh = ()=>{
                        if(kh?.gioitinh == 1)
                          return 'Male'
                        else if(kh?.gioitinh == 0)
                          return 'Female'
                        else
                          return 'Something else'
                      }
                      if(checkSearch(kh))
                      return(
                        <tr>
                          <td>{kh?.id}</td>
                          <td>{kh?.ten}</td>
                          <td>{kh?.ho}</td>
                          <td>{kh?.username}</td>
                          <td>{kh?.email}</td>
                          <td>{kh?.sdt}</td>
                          <td>{gioitinh()}</td>
                          <td style={{width:'10rem'}}><button className ="btn btn-info" data-target={'#'+kh?.username} data-toggle="modal">View</button></td>
                          <td style={{width:'10rem'}}><button className ="btn btn-danger" onClick = {()=> deleteKhachhang(kh?.username)}>Delete</button></td>
                          <div className="modal fade" id={kh?.username} tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                              <div className="modal-dialog modal-lg" role="document">
                                <div className="modal-content">
                                  <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title" id="exampleModalLabel">Customer Profile</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                      <span aria-hidden="true">×</span>
                                    </button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="row"> 
                                      <div className="col-4 text-center" style={{marginTop:'3rem'}}> 
                                        <img alt="pc" src={kh?.photo} className="rounded-circle w-50 mb-4 "  /><br/>
                                        <h5>{kh?.username}</h5>
                                      </div>
                                      <div className="col-8">
                                        <div className="table-responsive">
                                        <table className="table table-bordered">
                                          <tbody>
                                            <tr>
                                              <td>FullName</td>
                                              <td>{kh?.ten + ' ' + kh?.ho}</td>
                                            </tr>
                                            <tr>
                                              <td>Email</td>
                                              <td>{kh?.email}</td>
                                            </tr>
                                            <tr>
                                              <td>Phone number</td>
                                              <td>{kh?.sdt}</td>
                                            </tr>
                                            <tr>
                                              <td>Gender</td>
                                              <td>{gioitinh()}</td>
                                            </tr>
                                            <tr>
                                              <td>Address</td>
                                              <td>{getHomeAddress(kh)}</td>
                                            </tr>

                                          </tbody>
                                        </table>
                                        </div>
                                        
                                      </div>
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
