import React,{useState,useEffect} from 'react'
import {store} from '../firebase'
import * as sanphamApi from '../api/SanphamApi'
import * as danhmucApi from '../api/DanhmucApi'
import './SanphamManagement.css'
export default function SanphamManagement({search}) {
  const defalseImg = "https://www.tullamoreshow.com/custom/public/images/.600.360.0.1.t/gallery-10.png"
  const [open,setOpen] = useState(false)
  const [image,setImage] = useState([])
  const [progress,setProgress] =useState(0)
  const [sanpham,setSanpham] = useState({})
  const [listSP,setListSP] = useState([])
  const [danhmuc,setDanhmuc] = useState([])
  const [action, setAction] = useState('create')
  const [sortBy, setSortBy] = useState('masp')
  const [sortType, setSortType] = useState('asc')
  useEffect(async()=>{
      try {
        const list = await sanphamApi.getListSanphamwithSort(sortBy, sortType)
        await setListSP(list)

        const listDm = await danhmucApi.getDanhmuc()
        await setDanhmuc(listDm);
      } catch (error) {
         console.log(error)
      }
  },[])
  const refeshProduct = async ()=>{
    const list = await sanphamApi.getListSanpham()
    await setListSP(list)
  }
  const handleInputChange = (e)=>{
    const {value,name} = e.target;
    setSanpham({
      ...sanpham,
      [name]:value
    })
  }
  const openUpdateSanpham = (sp)=>{
    setAction('update')
    setOpen(true);
    setSanpham({
      ...sp,
      danhmuc:sp.danhmuc?.madm
    })
    setImage(sp.listHA.map(ha => ha.photo))
  }

  const closeImage = (myImg)=>{
    const myImage = image;
    setImage(myImage.filter((value,index) => {return value != myImg}))
    setProgress(0)
  }
  const handleSubmit = async ()=>{
    const photo = image.map(img => ({photo:img}))
    sanpham.listHA = photo
    const data = sanpham;
    data.danhmuc = {
      madm : sanpham.danhmuc
    }
    console.log(data)
    if(action === 'create'){
      try {
        await sanphamApi.insertSanpham(data)
        alert('Insert product successfully !!!')
        refeshProduct()
        setOpen(false)
      } catch (error) {
        alert('Insert product failed !!!')
      }
    }
    if(action === 'update'){
      try {
        await sanphamApi.updateSanpham(data)
        alert('update product successfully !!!')
        refeshProduct()
        setAction('create')
      } catch (error) {
        alert('update product failed !!!')
      }
      setOpen(false)
    }
  }
  const deleteProduct = async (masp) =>{
    try {
      await sanphamApi.deleteSanpham(masp);
      alert('Delete product successfully !!!')
      refeshProduct()
    } catch (error) {
      alert('Delete product failed !!!')
    }
  }
  const handleImage = async (e)=>{
  
    var file = e.target.files[0];

    const fileNameFirst = file?.name;
    const fileNameFinal = fileNameFirst?.replace(/ /g,'')
    var storageRef =  store.ref().child("images/"+fileNameFinal)
    
    // const metadata = {
    //   contentType: 'image/jpeg'
    // };
 
    const uploadTask = storageRef.put(file);
    // uploadTask.task.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //   function progress(snapshot){
    //     let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
    //     setProgress(percentage)
    //     console.log(12)
    //   }
    // )
    uploadTask.on(`state_changed`,snapshot=>{
      setProgress((snapshot.bytesTransferred/snapshot.totalBytes)*100)
    },
    (err)=>{
      console.log(err)
    },
    ()=>{
      store.ref().child('images').child(fileNameFinal).getDownloadURL().then(url=> setImage([...image,url]));
    }
    )
    
   // console.log(image)
   
}
const handleSortType = async(e)=>{
  setSortType(e.target.value)
  const list = await sanphamApi.getListSanphamwithSort(sortBy, e.target.value)
  console.log(list)
  await setListSP(list)
}

const handleSortBy = async (e)=>{
  setSortBy(e.target.value)
  const list = await sanphamApi.getListSanphamwithSort(e.target.value, sortType)
  await setListSP(list)
}
const checkSearch = (sp)=>{
  if(sp?.masp.toLowerCase().includes(search.toLowerCase()) || 
  sp?.tensp.toLowerCase().includes(search.toLowerCase()) )
    return true
  return false
}
    return (
        <div className="tourmn">
            {open?
            <div className="form-input">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <p className="form-input__head">
                    Form input product
                  </p>
                  <p onClick={()=>{setOpen(false); setImage([]); setAction('create') ; setSanpham({})}}>X</p>
                </div>
                <div className="card-body">
                  <p className="input-label">Product Name</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="tensp" value={sanpham.tensp} onChange={handleInputChange} />

                  <p className="input-label">Category</p>
                  <select className="custom-select my-1 mr-sm-2 mb-3" name='danhmuc' onChange={handleInputChange}>
                    {!sanpham.danhmuc?<option selected>Select</option>:''}
                    {danhmuc.map(dm =>{
                      return(
                        <option value={dm.madm} selected={dm.madm === sanpham?.danhmuc} >{dm.tendm}</option>
                      )
                    })}
                  </select>

                  <p className="input-label">Number</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="soluong" value={sanpham.soluong} onChange={handleInputChange} />

                  <p className="input-label">Price</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="dongia" value={sanpham.dongia} onChange={handleInputChange} />

                  <p className="input-label">Discount</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="khuyenmai" value={sanpham.khuyenmai} onChange={handleInputChange} />

                  <p className="input-label">Describe</p>
                  <input type="text" className="form-control mb-3" placeholder="Enter here ..." name="mota_ngan" value={sanpham.mota_ngan} onChange={handleInputChange} />

                  <p className="input-label">Describe Detail</p>
                  <textarea className="form-control mb-3" rows={3} defaultValue={""} placeholder="Enter here ..." value={sanpham.mota_chitiet} name="mota_chitiet" onChange={handleInputChange} />
                  <div className="progress mt-3" style={{height:14,width:'20vw'}}>
                    <div className="progress-bar bg-success" role="progressbar" style={{width: progress +'%'}}>{progress} %</div>
                  </div>
                  
                  <div className="image-upload">
                    <label for="file-input">
                      <div style={{cursor:'pointer'}}>
                        <img src={defalseImg} style={{width:100}}/>
                        <p>Pick an image</p>
                      </div>
                    </label>

                    <input id="file-input" type="file" className="mb-3" onChange={handleImage}/>
                  </div>
                  <div className="row mb-3">
                    {image.map((img,index)=>{
                      return(
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3 text-center myPictureContainer" key={index}>
                          <p className="cancelImg" onClick={() => closeImage(img)}>x</p>
                          <img alt="pt" src={img} className="input-img mb-4" />
                        </div>  
                      )
                    })}
                  </div>
                  <button type="submit" className="btn btn-info btn-input" onClick={handleSubmit}>Submit</button>
                  <button type="submit" className="btn btn-success btn-input">Reset</button>
                  <button type="submit" className="btn btn-danger btn-input" onClick={()=>{setOpen(false); setSanpham({})}}>Exit</button>
                </div>
              </div>
            </div>
            :
            <div>
              <div className="tourmn__head">
              <p className="tourmn__title">
                  Product List
              </p>
              <div className="d-flex w-50 justify-content-around">
                  <select className="custom-select my-1 mr-sm-2 w-50" name="sortBy" onChange={handleSortBy}>
                    <option selected value={'masp'}>Sort field</option>
                    <option value={'masp'}>Product ID</option>
                    <option value={'tensp'}>Product Name</option>
                    <option value={'soluong'}>Number</option>
                    <option value={'dongia'}>Price</option>
                  </select>
                  <select className="custom-select my-1 mr-sm-2 w-50" name="sortType" onChange={handleSortType}>
                    <option selected value={'asc'}>Sort Type</option>
                    <option value={'asc'}>Ascending</option>
                    <option value={'desc'}>Descending</option>
                  </select>
                <button className="btn btn-info w-25" onClick={()=>setOpen(true)}>Add Product</button>
              </div>
            </div>
            <div className="tourmn__table mt-2">
                <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Product ID</th>
                      <th scope="col">Product Name</th>
                      <th scope="col">Category List</th>
                      <th scope="col">Number</th>
                      <th scope="col">Price</th>
                      <th scope="col">Discount</th>
                      <th scope="col">Describe</th>
                      <th scope="col">Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listSP.map(t=>{
                      if(checkSearch(t))
                      return(
                        <tr key={t.masp} onDoubleClick={()=>openUpdateSanpham(t)}>
                          <td>{t.masp}</td>
                          <td>{t.tensp}</td>
                          <td>{t.danhmuc?.tendm}</td>
                          <td>{t.soluong}</td>
                          <td>{t.dongia}</td>
                          <td>{t.khuyenmai * 100} %</td>
                          <td>{t.mota}</td>
                          <td><button className="btn btn-info mr-1" data-toggle="modal" data-target={'#' + t.masp}>View</button> <button className="btn btn-danger" onClick={()=> deleteProduct(t.masp)}>Delete</button></td>
                          <div className="modal" id={t.masp}>
                              <div className="modal-dialog modal-lg">
                                  <div className="modal-content">

                                  <div className="modal-header">
                                      <h3 className="modal-title display-4">{t.tensp}</h3>
                                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  </div>

                                  
                                  <div className="modal-body px-4">
                                      <div className="row detail_product_admin px-4">
                                          <div className="col-5">
                                          <div id={'cr' + t.masp} class="carousel slide" data-ride="carousel">
                                            <div class="carousel-inner">
                                              {t.listHA?.map((ha,index) =>{
                                                return(
                                                  <div class={ index===0 ? 'carousel-item active' : 'carousel-item'} key={index}>
                                                    <img src={ha.photo} alt="Los Angeles" style={{width:'100%'}}/>
                                                  </div>
                                                )
                                              })}
                                            </div>

                                            <a class="carousel-control-prev" href={'#cr' + t.masp} data-slide="prev">
                                              <span class="carousel-control-prev-icon navigation-icon"></span>
                                            </a>
                                            <a class="carousel-control-next" href={'#cr' + t.masp} data-slide="next">
                                              <span class="carousel-control-next-icon navigation-icon"></span>
                                            </a>

                                          </div>
                                    </div>
                                          <div className="col-7">
                                              <h3>{t.tensp}</h3>
                                              <h4 className="text-danger">{t.dongia} $</h4>
                                              <hr/>
                                              <div className="row">
                                                  <div className="col-6">
                                                      <p>Category</p>
                                                  </div>
                                                  <div className="col-6 text-right">
                                                      <p>{t.danhmuc?.tendm}</p>
                                                  </div>
                                              </div>
                                              <hr/>
                                              <div className="row">
                                                  <div className="col-5">
                                                      <p>Describe</p>
                                                  </div>
                                                  <div className="col-7 text-right">
                                                      <p>{t.mota_ngan}</p>
                                                  </div>
                                              </div>
                                              <hr/>
                                              <div className="row">
                                                  <div className="col-5">
                                                      <p>Items remain</p>
                                                  </div>
                                                  <div className="col-7 text-right">
                                                      <p>Items : {t.soluong}</p>
                                                  </div>
                                              </div>

                                          </div>
                                          <div className='col-12 mt-4'>
                                          <h5>Describe Detail</h5>
                                          <p>{t.mota_chitiet}</p>
                                      </div>
                                      </div>
                                      
                                  </div>

                                  
                                  <div className="modal-footer">
                                      <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
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
            }
        </div>
    )
}
