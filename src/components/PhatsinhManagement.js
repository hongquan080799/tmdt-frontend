import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as phatsinhApi from '../api/PhatsinhApi'
import * as ctpsApi from '../api/CtpsApi'
import * as sanphamApi from '../api/SanphamApi'
export default function PhatsinhManagement() {
  const [listPS, setListPS] = useState([])
  const [phatsinh, setPhatsinh] = useState()
  const [maphieu, setMaphieu] = useState()
  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setPhatsinh({
        ...phatsinh,
        [name]:value
    })
  }
  const handleInputChangeCT = (e)=>{
    const {name, value} = e.target
    setCtps({
        ...ctps,
        [name]:value
    })
  }
  useEffect(async()=>{
    try {
        const data = await phatsinhApi.getListPhatsinh()
        setListPS(data)
        console.log(data)
    } catch (error) {
        console.log(error)
    }
},[])
useEffect(async()=>{
  try {
      const data = await ctpsApi.getListCtps(maphieu)
      setListCT(data)
      const dataSP = await sanphamApi.getListSanpham()
      setListSP(dataSP)
  } catch (error) {
      console.log(error)
  }
},[maphieu])
  const [listCT, setListCT] = useState([])
  const [ctps, setCtps] = useState()
  const [listSP, setListSP] = useState([])
  const [action, setAction] = useState('create')
  const [find, setFind] = useState('')
  const handleInputCTChange = (e)=>{
    const {name, value} = e.target
    setCtps({
        ...ctps,
        [name]:value
    })
  }
  const handleSubmitCT = async(e)=>{
    e.preventDefault();
    if(action == 'create'){
      if(ctps.masp == null)
      alert('Please enter product')
      const data = {
          ...ctps,
          maphieu
      }
      try {
          const res = await ctpsApi.insertCtps(data)
          alert('Insert Incurred detail succcessfully !')
          const data2 = await ctpsApi.getListCtps(maphieu)
          setListCT(data2)
          const dataSP = await sanphamApi.getListSanpham()
          setListSP(dataSP)
      } catch (error) {
          console.log(error)
          alert('Insert Incurred detail failed  !')
      }
    }
    else{
      if(ctps.masp == null)
      alert('Please enter product')
      const data = {
          ...ctps,
          maphieu
      }
      console.log(data)
      try {
          const res = await ctpsApi.updateCtps(data)
          const data2 = await ctpsApi.getListCtps(maphieu)
          setListCT(data2)
          const dataSP = await sanphamApi.getListSanpham()
          setListSP(dataSP)
          alert('Update Incurred detail succcessfully !')
         
      } catch (error) {
          console.log(error)
          alert('Update Incurred detail failed  !')
      }
    }
    setAction('create')
} 
  const handleDeleteCT = async(maphieu, masp) =>{
    if(window.confirm('Do you want to delete this incurred detail !')){
        try {
            const res = await ctpsApi.deleteCtps({maphieu, masp})
            const data2 = await ctpsApi.getListCtps(maphieu)
            setListCT(data2)
            const dataSP = await sanphamApi.getListSanpham()
            setListSP(dataSP)
            alert('Delete incurred successfully !!!')
        } catch (error) {
            alert('Delete incurred failed !!!')
            console.log(error)
        }
    }
}
const handleChooseSP = (masp)=>{
  setCtps({
      ...ctps,
      masp
  })
}
const getUpdate = (ct) =>{
  setAction('update')
  setCtps({
      maphieu : ct?.phatsinh?.id,
      masp : ct?.sanpham?.masp,
      soluong : ct?.soluong,
      dongia : ct?.dongia,
  })
}
  const handleSubmit = async(e)=>{
      e.preventDefault();
      try {
          const res = await phatsinhApi.insertPhatsinh(phatsinh?.loai)
          alert('Insert incurred successfully !')
          setPhatsinh({})
          const data = await phatsinhApi.getListPhatsinh()
          setListPS(data)
      } catch (error) {
          alert('Insert incurred failed !')
      }

  }
  const handleDelete = async(id) =>{
        if(window.confirm('Do you want to delete this incurred !')){
            try {
                const res = await phatsinhApi.deletePhatsinh(id)
                const data = await phatsinhApi.getListPhatsinh()
                setListPS(data)
            } catch (error) {
                alert('Delete incurred failed !!!')
            }
        }
  }
  
    return (
        <div className="tourmn">
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Incurred List
              </p>
              <button className="btn btn-info" data-toggle="modal" data-target="#exampleModal">Add Incurred</button>
              <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div className="modal-dialog" role="document">
                    <div className="modal-content">
                      <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title" id="exampleModalLabel">Form incurred</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                          <p className="input-label">Incurred type</p>
                          <select className="custom-select my-1 mr-sm-2 mb-4" name = "loai" value={phatsinh?.loai} onChange = {handleInputChange}>
                            <option selected>Choose...</option>
                            <option value={'N'}>Import</option>
                            <option value={'X'}>Export</option>
                          </select>
                        </form>            
                      </div>
                      <div className="modal-footer">
                        <button type="submit" className="btn btn-info" onClick={handleSubmit} data-dismiss="modal">Submit</button>
                        <button type="button" className="btn btn-secondary">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className={maphieu == null ? 'tourmn__table mt-2' : 'ps__table mt-2' }>
                <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Incurred ID</th>
                      <th scope="col">Date</th>
                      <th scope="col">Type</th>
                      <th scope="col">Employee</th>
                      <th scope="col">Delete</th>
                      {/* <th scope="col">Detail</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {listPS.map(ps =>{
                      return(
                        <tr className={maphieu == ps?.id ? 'ps__row__select' : 'ps__row'} onClick={()=> setMaphieu(ps?.id)}>
                          <td>{ps?.id}</td>
                          <td>{ps?.ngay}</td>
                          <td>{ps?.loai == 'N' ? 'Import' : 'Export'}</td>
                          <td>{ps?.nhanvien != null ?ps?.nhanvien?.ho + ' ' + ps?.nhanvien?.ten:'Admin' }</td>
                          <td style={{width:'12rem'}}><button className ="btn btn-danger" onClick = {()=> handleDelete(ps?.id)}>Delete</button></td>
                          {/* <td style={{width:'12rem'}}><button className ="btn btn-info" onClick={()=> window.location.replace(`/admin/phatsinh/${ps?.id}`)}>View</button></td> */}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                </div>
                
              </div>  
            </div>


            {maphieu != null &&
              <div className="mt-4">
                <div className="tourmn__head">
                  <p className="tourmn__title">
                      Detail List
                  </p>
                  <button className="btn btn-info" data-toggle="modal" data-target="#addps">Add detail</button>
                  <div className="modal fade" id="addps" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div className="modal-body">
                          <form>
                              <p className="input-label">Product</p>
                              <input type="text" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.masp} readOnly={true} placeholder="Enter product ..." data-target="#chooseSP" data-toggle={action != 'update' ?"modal":''} />
                              <p className="input-label">Number</p>
                              <input type="number" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.soluong} placeholder="Enter number ..." name="soluong" onChange={handleInputChangeCT} />
                              <p className="input-label">Price</p>
                              <input type="text" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.dongia} placeholder="Enter price ..." name="dongia" onChange={handleInputChangeCT}/>
                            </form>
                  
                          </div>
                          <div className="modal-footer">
                            <button type="submit" className="btn btn-info btn-input" onClick={handleSubmitCT} data-dismiss="modal">Submit</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>                          
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="chooseSP" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                  <div className="modal-dialog modal-xl" role="document">
                                    <div className="modal-content">
                                      <div className="modal-header bg-info text-white">
                                        <h5 className="modal-title" id="exampleModalLabel">List Product</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                          <span aria-hidden="true">×</span>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Search" onChange={(e)=> setFind(e.target.value)} />
                                        <div className="table-responsive table-bordered table-hover">
                                        <table className="table">
                                          <thead>
                                            <tr>
                                              <th scope="col">Product ID</th>
                                              <th scope="col">Product Name</th>
                                              <th scope="col">Price</th>
                                              <th scope="col">Number</th>
                                              <th scope="col">Category</th>
                                              <th scope="col">Discount</th>
                                              <th scope="col">Photo</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {listSP?.map(sp =>{
                                              if(sp?.masp.toLowerCase().includes(find.toLocaleLowerCase()) || sp?.tensp.toLowerCase().includes(find.toLocaleLowerCase()))
                                                return(
                                                    <tr style={{cursor:'pointer'}} onClick={()=>handleChooseSP(sp?.masp)} data-dismiss="modal">
                                                        <td>{sp?.masp}</td>
                                                        <td>{sp?.tensp}</td>
                                                        <td>{sp?.dongia}</td>
                                                        <td>{sp?.soluong}</td>
                                                        <td>{sp?.danhmuc?.tendm}</td>
                                                        <td>{sp?.khuyenmai}</td>
                                                        <td><img src={sp?.listHA[0]?.photo} style={{height:50}} alt ='pt'/></td>
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
                </div>
                  
                <div className="ps__table mt-2">
                    <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Incurred ID</th>
                          <th scope="col">Product ID</th>
                          <th scope="col">Product Name</th>
                          <th scope="col">Number</th>
                          <th scope="col">Price</th>
                          <th scope="col">Delete</th>
                          <th scope="col">Update</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listCT.map(ct =>{
                          return(
                            <tr>
                              <td>{ct?.phatsinh?.id}</td>
                              <td>{ct?.sanpham?.masp}</td>
                              <td>{ct?.sanpham?.tensp}</td>
                              <td>{ct?.soluong}</td>
                              <td>{ct?.dongia}</td>
                              <td style={{width:'12rem'}}><button className ="btn btn-danger" onClick = {()=> handleDeleteCT(ct?.phatsinh?.id, ct?.sanpham?.masp)}>Delete</button></td>
                              <td style={{width:'12rem'}}><button className ="btn btn-info" data-toggle="modal" data-target="#addps" onClick={()=>getUpdate(ct)}>Update</button></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    </div>
                    
                  </div>  
              </div>
            }
        </div>
    )
}