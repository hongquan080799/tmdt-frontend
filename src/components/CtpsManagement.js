import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as ctpsApi from '../api/CtpsApi'
import * as sanphamApi from '../api/SanphamApi'
export default function CtpsManagement({maphieu}) {
  const [open,setOpen] = useState(false)
  const [listCT, setListCT] = useState([])
  const [ctps, setCtps] = useState()
  const [listSP, setListSP] = useState([])
  const [action, setAction] = useState('create')
  const [find, setFind] = useState('')
  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setCtps({
        ...ctps,
        [name]:value
    })
  }
  const handleSubmit = async(e)=>{
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
            window.location.reload()
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
            alert('Update Incurred detail succcessfully !')
            window.location.reload()
        } catch (error) {
            console.log(error)
            alert('Update Incurred detail failed  !')
        }
      }

  }
  const handleDelete = async(maphieu, masp) =>{
        if(window.confirm('Do you want to delete this incurred detail !')){
            try {
                const res = await ctpsApi.deleteCtps({maphieu, masp})
                alert('Delete incurred successfully !!!')
                window.location.reload()
            } catch (error) {
                alert('Delete incurred failed !!!')
                console.log(error)
            }
        }
  }
  const getUpdate = (ct) =>{
      setOpen(true)
      setAction('update')
      setCtps({
          maphieu : ct?.phatsinh?.id,
          masp : ct?.sanpham?.masp,
          soluong : ct?.soluong,
          dongia : ct?.dongia,
      })
  }
  useEffect(async()=>{
      try {
          const data = await ctpsApi.getListCtps(maphieu)
          setListCT(data)
          const dataSP = await sanphamApi.getListSanpham()
          setListSP(dataSP)
      } catch (error) {
          console.log(error)
      }
  },[])
  const handleChooseSP = (masp)=>{
      setCtps({
          ...ctps,
          masp
      })
  }
    return (
        <div className="tourmn">
            {open?
            <div className="form-input">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <p className="form-input__head">
                    Form input incurred
                  </p>
                  <p onClick={()=> {setOpen(false); setAction('create')}}>X</p>
                </div>
                <form className="card-body" onSubmit={handleSubmit}>
                  <p className="input-label">Product</p>
                  <input type="text" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.masp} readOnly={true} placeholder="Enter product ..." data-target="#chooseSP" data-toggle={action != 'update' ?"modal":''} />
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
                  <p className="input-label">Number</p>
                  <input type="number" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.soluong} placeholder="Enter number ..." name="soluong" onChange={handleInputChange} />
                  <p className="input-label">Price</p>
                  <input type="text" className="form-control mb-2 mr-sm-2 mb-3" value={ctps?.dongia} placeholder="Enter price ..." name="dongia" onChange={handleInputChange}/>
                  <button type="submit" className="btn btn-info btn-input" onClick={handleSubmit}>Submit</button>
                  <button type="reset" className="btn btn-success btn-input">Reset</button>
                  <button type="button" className="btn btn-danger btn-input" onClick={()=>setOpen(false)}>Exit</button>
                </form>
              </div>
            </div>
            :
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Incurred List
              </p>
              <button className="btn btn-info" onClick={()=>setOpen(true)}>Add Incurred</button>
            </div>
            <div className="tourmn__table mt-2">
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
                          <td style={{width:'12rem'}}><button className ="btn btn-danger" onClick = {()=> handleDelete(ct?.phatsinh?.id, ct?.sanpham?.masp)}>Delete</button></td>
                          <td style={{width:'12rem'}}><button className ="btn btn-info" onClick={()=>getUpdate(ct)}>Update</button></td>
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
