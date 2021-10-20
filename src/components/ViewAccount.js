import React,{useState,useEffect, useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { store } from '../firebase'
import * as ghnApi from '../api/GhnApi'
import * as userApi from '../api/UserApi'
export default function ViewAccount() {
    const [changePass,setChangePass] =useState(false)
    const [state, setState] = useContext(UserContext)
    const [user,setUser] = useState()
    const [diachi, setDiachi] = useState({})
    const [userUpdate, setUserUpdate] = useState({})
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const [newPass, setNewPass] = useState({})
    const [progress,setProgress] =useState(0)
    const [image,setImage] = useState("https://img.icons8.com/material-sharp/96/000000/user-male-circle.png")
    // const submitUpdate = ()=>{
    //     axios.put(process.env.REACT_APP_API +'khachhang/',user,header)
    //     .then(response => {
    //         alert('Sửa thành công')
    //         setChangePass(false)
    //     })
    //     .catch(error => console.log(error))
    // }
    // const handlChangeTK = (e)=>{
    //     const {value,name} = e.target
    //     setTk({
    //         ...tk,
    //         [name]:value
    //     })
    // }
    const handleImage = async (e)=>{
  
        // code here
        var file = e.target.files[0];
       // console.log('dsds')
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
          store.ref().child('images').child(fileNameFinal).getDownloadURL().then(url=> setImage(url));
        }
        )
    }
    useEffect(async()=>{
      try {
        const province = await ghnApi.getProvince();
        setProvinces(province.data)
      } catch (error) {
          console.log(error)
      }
      
    },[])
    useEffect(async()=>{
      setImage(state?.user?.photo)
      setUserUpdate({
        ...userUpdate,
        ho:state?.user?.ho,
        ten:state?.user?.ten,
        sdt:state?.user?.sdt,
        email:state?.user?.email,
        gioitinh:state?.user?.gioitinh,
        photo:state?.user?.photo,
        listDC:state?.user?.listDC.filter(dc => dc.isHomeAddress === true)
      })
     //loadDiachi()
     const provinceID = state?.user?.listDC[0]?.provinceId
     loadDistrict(provinceID)

     const districtID = state?.user?.listDC[0]?.districtId
     loadWard(districtID)

    },[state])
    const handleSubmit = async()=>{
      try { 
         const dataUpdate = {
             ...userUpdate,
             photo:image
         }
         const res = await userApi.updateAccount(dataUpdate)
         alert('Update successfully !!!')
         window.location.reload()
      } catch (error) {
        console.log(error)
        alert('Update failed !!!')
      }
    }

    const changePassWord = ()=>{
  
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
    const handleInputChange = (e)=>{
      const {name, value} = e.target;
        if(name === 'province'){
            loadDistrict(Number(value))
            const province = provinces?.filter(pv => pv.ProvinceID == value)[0]
            let listDC = userUpdate.listDC?userUpdate.listDC:[]
            
            listDC[0] = {
                ...listDC[0],
                provinceId:province?.ProvinceID,
                provinceName:province?.ProvinceName,
            }
            setUserUpdate({
                ...userUpdate,
                listDC
            })
            return;
        }
        if(name === 'district'){
            loadWard(Number(value))
            const district = districts?.filter(pv => pv.DistrictID == value)[0]
            let listDC = userUpdate.listDC?userUpdate.listDC:[]
            listDC[0] = {
                ...listDC[0],
                districtId:district?.DistrictID,
                districtName:district?.DistrictName,
            }
            setUserUpdate({
                ...userUpdate,
                listDC
            })
            return
        }
        if(name === 'ward'){
            const ward = wards?.filter(pv => pv.WardCode == value)[0]
            let listDC = userUpdate.listDC?userUpdate.listDC:[]
            listDC[0] = {
                ...listDC[0],
                wardCode:ward?.WardCode,
                wardName:ward?.WardName,
            }
            setUserUpdate({
                ...userUpdate,
                listDC
            })
            return
        }
        if(name === 'addressDetail'){
            let listDC = userUpdate.listDC?userUpdate.listDC:[]
            listDC[0] = {
                ...listDC[0],
                [name]:value
            }
            setUserUpdate({
                ...userUpdate,
                listDC
            })
            return
        }
        setUserUpdate({
            ...userUpdate,
            [name]:value
        })
    }
    const getHomeAddress = ()=>{
      if(userUpdate?.listDC != null){
          for(let i = 0 ; i< userUpdate?.listDC?.length ; i++){
              if(userUpdate?.listDC[i]?.isHomeAddress){
                return userUpdate?.listDC[i]
            }
          }
      }
      else{
          return <p className="text-info shipTo__change">Add shiping address</p>
      }
  }
    const handleChangePass = (e)=>{
        setNewPass(e.target.value)
    }
    const submitChangePass = async ()=>{
        if(newPass == null){
            alert('Please enter new pass')
        }
        try {
            const res = await userApi.changePassword(newPass)
            alert('Change password successfully !!!')
            setChangePass(false)
        } catch (error) {
            console.log(error)
            alert('Change password failed !!!')
        }
    }
    return (
        <div>
            {!changePass?
            <div className="card mt-4" style={{width: '80%'}}>
                <div className="card-header bg-success text-white">THÔNG TIN TÀI KHOẢN</div>
              <div className="card-body">
               Họ
               <input type="text" className="form-control mb-2 mr-sm-2" value={userUpdate?.ho} name="ho" onChange={handleInputChange}/>
               Tên
               <input type="text" className="form-control mb-2 mr-sm-2" value={userUpdate?.ten} name="ten" onChange={handleInputChange} />
               Giới tính
                
                    <select className="custom-select my-1 mr-sm-2" value={userUpdate?.gioitinh} name="gioitinh" onChange={handleInputChange}>
                        <option value={1}>Nam</option>
                        <option value={0}>Nữ</option>
                    </select> 
                
               Số điện thoại
               <input type="text" className="form-control mb-2 mr-sm-2" value={userUpdate?.sdt} name="sdt" onChange={handleInputChange}/>
               Email
               <input type="text" className="form-control mb-2 mr-sm-2" value={userUpdate?.email} name="email" onChange={handleInputChange}/>
               Địa chỉ
               <div className="form-inline d-flex justify-content-between">
                  <select className="custom-select my-1 mr-sm-2"  style={{width:'30%'}} name="province" onChange={handleInputChange}>
                      <option>Province </option>
                      {provinces?.map(value =>{
                          return(
                              <option value={value.ProvinceID} selected = {getHomeAddress()?.provinceId == value.ProvinceID}>{value.ProvinceName}</option>
                          )
                      })}
                  </select>
                  <select className="custom-select my-1" style={{width:'30%'}} name="district" onChange={handleInputChange}>
                      <option>District</option>
                      {districts?.map(value =>{
                          return(
                              <option value={value.DistrictID} selected ={getHomeAddress()?.districtId == value.DistrictID}>{value.DistrictName}</option>
                          )
                      })}
                  </select>
                  <select className="custom-select my-1" style={{width:'30%'}} name="ward" onChange={handleInputChange}>
                      <option>Ward</option>
                      {wards?.map(value =>{
                          return(
                              <option value={value.WardCode} selected ={getHomeAddress()?.wardCode == value.WardCode}>{value.WardName}</option>
                          )
                      })}
                  </select>
                  
              </div>
              <input type="text" className="form-control mb-2 mr-sm-2 mt-2" defaultValue={getHomeAddress()?.addressDetail} placeholder = "Enter your address" name="addressDetail" onChange={handleInputChange}/>
            

              <div className="progress mt-3" style={{height:14,width:'20vw'}}>
                <div className="progress-bar bg-success" role="progressbar" style={{width: progress +'%'}}>{progress} %</div>
                </div>
                <div className="image-upload">
                    <label for="file-input">
                    <div style={{cursor:'pointer'}}>
                    <img src="https://img.icons8.com/clouds/100/000000/upload.png" style={{width:50}}/>
                        <p>Pick an image</p>
                    </div>
                    </label>

                    <input id="file-input" type="file" className="mb-4" onChange={handleImage}/>
                </div>
                <div className="row mb-3">
                    <div className="col-12 col-sm-12 col-md-4 col-lg-3">
                        <img alt="pt" src={image} className="input-img mb-4" style={{width:100}} />
                    </div>  
                </div>
                <button type="button" className="btn btn-success mr-4 mt-4" data-dismiss="modal" onClick={()=>setChangePass(true)}>Thay đổi mật khẩu</button>
                <button type="button" className="btn btn-outline-success mt-4" data-dismiss="modal" onClick={handleSubmit} >Lưu thay đổi</button>
              </div>
            </div>
            :
            <div className="card mt-4" style={{width: '50%'}}>
              <div className="card-body">
                <h5 className="card-title">Thay đổi mât khẩu</h5>
                <p>Username</p>
                <input type="text" className="form-control mb-2 mr-sm-2" placeholder="Nhập username" name="username" value={state?.user?.username} disabled/>
                <p>Password</p>
                <input type="password" className="form-control mb-2 mr-sm-2" placeholder="Nhập password mới" onChange={handleChangePass} name="password" />
                <button className="btn btn-primary mr-4 mt-3" type="button" onClick={submitChangePass} >Xác nhận</button>
                <button className="btn btn-outline-primary mr-4 mt-3" type="button" onClick={()=> setChangePass(false)}>Thoát</button>
              </div>
            </div>
            }
        </div>
    )
}
