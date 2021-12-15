import React,{useState,useEffect} from 'react'
import './SanphamManagement.css'
import * as voucherApi from '../api/VoucherApi'
import {db} from '../firebase'
import firebase from 'firebase'
export default function VoucherManagement({search}) {
  const [list, setList] = useState([])
  const [voucher, setVoucher] = useState({})
  const [sort, setSort] = useState({
    sortType : 'asc',
    sortField : 'id'
  })
  const writeData = (key , value) =>{
    db.collection(key).doc().set(value)
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });
  }
  useEffect(async()=>{
    try {
      const data = await voucherApi.getListVoucher();
      setList(data)
      setVoucher({
          ...voucher,
          startDate : new Date().toJSON().slice(0,19)
      })
    } catch (error) {
      console.log(error)
    }
  },[])
    const handleSort = async(e)=>{
      const {name, value} = e.target
      const mySort = {
        ...sort,
        [name]:value
      }
      setSort(mySort)
      const data = await voucherApi.getListVoucherWithSort(mySort.sortField, mySort.sortType)
      setList(data)
    }
    const handleInputChange = (e)=>{
        const {name, value} = e.target
        setVoucher({
            ...voucher,
            [name]: value
        })
    }
    const insertVoucher = async ()=>{
        try {
            const res = await voucherApi.insertVoucher(voucher)
            alert('Insert successfully !!!')
            const data = await voucherApi.getListVoucher();
            setList(data)
            setVoucher({
                startDate : new Date().toJSON().slice(0,19)
            })
        } catch (error) {
            alert('Insert failed !!!')
            console.log(error)
        }
    }
    const deleteVoucher = async (voucherId)=>{
        try {
            const res = await voucherApi.deleteVoucher(voucherId)
            alert('Delete successfully !!!')
            const data = await voucherApi.getListVoucher();
            setList(data)
            setVoucher({
                startDate : new Date().toJSON().slice(0,19)
            })
        } catch (error) {
            alert('Delete failed !!!')
        }
    }
    const applyFirebase = (myVoucher)=>{
        writeData("voucher", {
          ...myVoucher,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
        })
    }
    return (
        <div className="tourmn">
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Customer List
              </p>
              <div className="d-flex justify-content-around" style={{width:'40%'}}>
                  <select className="custom-select my-1 mr-sm-2 " style={{width:200}} name="sortField" onChange={handleSort}>
                    <option selected value={'id'}>Sort field</option>
                    <option value={'startDate'}>Start date</option>
                    <option value={'endDate'}>End date</option>
                    <option value={'discount'}>Discount percentage</option>
                  </select>
                  <select className="custom-select my-1 mr-sm-2" style={{width:200}}  name="sortType" onChange={handleSort}>
                    <option selected value={'asc'}>Sort Type</option>
                    <option value={'asc'}>Ascending</option>
                    <option value={'desc'}>Descending</option>
                  </select>
                  <button className="btn btn-info" data-toggle="modal" data-target="#exampleModal">Add Voucher</button>
                  <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                          <div className="modal-header bg-info text-white">
                            <h5 className="modal-title" id="exampleModalLabel">Form input voucher</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <p className="input-label">Discount percentage</p>
                            <input type="number" className="form-control mb-3" placeholder="Enter here ..." name="discount" value={voucher?.discount} onChange={handleInputChange} />
                            <p className="input-label">Start date</p>
                            <input type="datetime-local" className="form-control mb-3" min={new Date().toJSON().slice(0,19)} placeholder="Enter here ..." name="startDate" value={voucher?.startDate} onChange={handleInputChange} />
                            <p className="input-label">End date</p>
                            <input type="datetime-local" className="form-control mb-3" min={voucher?.startDate} placeholder="Enter here ..." name="endDate" value={voucher?.endDate} onChange={handleInputChange} />
  
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={insertVoucher}>Save changes</button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
              </div>
             
            </div>
            <div className="tourmn__table mt-2">
                <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Discount percentage</th>
                      <th scope="col">Start date</th>
                      <th scope="col">End date</th>
                      <th scope="col">Apply</th>
                      <th scope="col">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list?.map(v =>{
                
                     // if(checkSearch(kh))
                      return(
                        <tr>
                          <td>{v?.id}</td>
                          <td>{v?.discount * 100} %</td>
                          <td>{new Date(v?.startDate).toLocaleString("th-TH")}</td>
                          <td>{new Date(v?.endDate).toLocaleString("th-TH")}</td>
                          <td><button className="btn btn-info" onClick={()=> applyFirebase(v)}>Apply</button></td>
                          <td><button className="btn btn-danger" onClick={()=> deleteVoucher(v?.id)}>Delete</button></td>
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
