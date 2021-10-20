import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as phatsinhApi from '../api/PhatsinhApi'
export default function PhatsinhManagement() {
  const [open,setOpen] = useState(false)
  const [listPS, setListPS] = useState([])
  const [phatsinh, setPhatsinh] = useState()
  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setPhatsinh({
        ...phatsinh,
        [name]:value
    })
  }
  const handleSubmit = async(e)=>{
      e.preventDefault();
      try {
          const res = await phatsinhApi.insertPhatsinh(phatsinh?.loai)
          alert('Insert incurred successfully !')
          setOpen(false)
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
  useEffect(async()=>{
      try {
          const data = await phatsinhApi.getListPhatsinh()
          setListPS(data)
          console.log(data)
      } catch (error) {
          console.log(error)
      }
  },[])
    return (
        <div className="tourmn">
            {open?
            <div className="form-input">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <p className="form-input__head">
                    Form input incurred
                  </p>
                  <p onClick={()=> setOpen(false)}>X</p>
                </div>
                <form className="card-body" onSubmit={handleSubmit}>
                  <p className="input-label">Incurred type</p>
                  <select className="custom-select my-1 mr-sm-2 mb-4" name = "loai" value={phatsinh?.loai} onChange = {handleInputChange}>
                    <option selected>Choose...</option>
                    <option value={'N'}>Import</option>
                    <option value={'X'}>Export</option>
                  </select>
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
                      <th scope="col">Date</th>
                      <th scope="col">Type</th>
                      <th scope="col">Employee</th>
                      <th scope="col">Delete</th>
                      <th scope="col">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listPS.map(ps =>{
                      return(
                        <tr>
                          <td>{ps?.id}</td>
                          <td>{ps?.ngay}</td>
                          <td>{ps?.loai == 'N' ? 'Import' : 'Export'}</td>
                          <td>{ps?.nhanvien != null ?ps?.nhanvien?.ho + ' ' + ps?.nhanvien?.ten:'Admin' }</td>
                          <td style={{width:'12rem'}}><button className ="btn btn-danger" onClick = {()=> handleDelete(ps?.id)}>Delete</button></td>
                          <td style={{width:'12rem'}}><button className ="btn btn-info" onClick={()=> window.location.replace(`/admin/phatsinh/${ps?.id}`)}>View</button></td>
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
