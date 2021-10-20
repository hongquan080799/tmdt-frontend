import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as danhmucApi from '../api/DanhmucApi'
import { map } from 'bluebird'
export default function DanhmucManagement({search}) {
  const [open,setOpen] = useState(false)
  const [listDM, setListDM] = useState([])
  const [danhmuc, setDanhMuc] = useState()
  const [action, setAction] = useState('create')
  const handleInputChange = (e)=>{
    const {name, value} = e.target
    setDanhMuc({
        ...danhmuc,
        [name]:value
    })
  }
  const handleSubmit = async(e)=>{
      e.preventDefault();
      if(action == 'create'){
          try {
            const response = await danhmucApi.postDanhmuc(danhmuc)
            const data = await danhmucApi.getDanhmuc()
            setListDM(data)
            alert('Insert category success !!!')
            setOpen(false)
          } catch (error) {
            alert('Insert category failed !!!')
            console.log(error)
          }
      }
      else if(action == 'update'){
        try {
          const response = await danhmucApi.updateDanhmuc(danhmuc)
          const data = await danhmucApi.getDanhmuc()
          setListDM(data)
          alert('Update category success !!!')
          setOpen(false)
          setDanhMuc({})
          setAction('create')
        } catch (error) {
          alert('Update category failed !!!')
          console.log(error)
        }
      }

  }
  const getUpdate = (dm)=>{
    setOpen(true)
    setAction('update')
    setDanhMuc({
      madm:dm.madm,
      tendm:dm.tendm
    })
  }
  const deleteDanhmuc = async (madm)=>{
    if(window.confirm('Do your want to delete Category : ' + madm +' ?')){
      try {
        const response = await danhmucApi.deleteDanhmuc(madm)
        const data = await danhmucApi.getDanhmuc()
        setListDM(data)
        alert('Delete category success !!!')
      } catch (error) {
        alert('Delete category failed !!!')
        console.log(error)
      }
    }
  }
  useEffect(async()=>{
    try {
      const data = await danhmucApi.getDanhmuc()
      setListDM(data)
    } catch (error) {
      console.log(error)
    }
  },[])
  const checkSearch = (dm)=>{
    if(dm?.madm.toLowerCase().includes(search.toLowerCase()) || dm?.tendm.toLowerCase().includes(search.toLowerCase()))
      return true
    return false;
  }
    return (
        <div className="tourmn">
            {open?
            <div className="form-input">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <p className="form-input__head">
                    Form input category
                  </p>
                  <p onClick={()=> setOpen(false)}>X</p>
                </div>
                <form className="card-body" onSubmit={handleSubmit}>
                  <p className="input-label">Category Name</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="tendm" value={danhmuc.tendm} onChange={handleInputChange} />          
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
                  Category List
              </p>
              <button className="btn btn-info" onClick={()=>setOpen(true)}>Add Category</button>
            </div>
            <div className="tourmn__table mt-2">
                <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Category ID</th>
                      <th scope="col">Category Name</th>
                      <th scope="col">Delete</th>
                      <th scope="col">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listDM?.map(dm =>{
                      if(checkSearch(dm))
                      return(
                        <tr>
                          <td>{dm?.madm}</td>
                          <td>{dm?.tendm}</td>
                          <td style={{width:'15rem'}}><button className ="btn btn-danger" onClick={() => deleteDanhmuc(dm?.madm)}>Delete</button></td>
                          <td style={{width:'15rem'}}><button className ="btn btn-info" onClick={()=> getUpdate(dm)}>Update</button></td>
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
