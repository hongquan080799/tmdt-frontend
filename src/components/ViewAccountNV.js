import React,{useState,useEffect, useContext} from 'react'
import { UserContext } from '../context/UserContext'
import { store } from '../firebase'
import * as ghnApi from '../api/GhnApi'
import * as userApi from '../api/UserApi'
export default function ViewAccount() {
    const [changePass,setChangePass] =useState(false)
    const [state, setState] = useContext(UserContext)
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
      setImage(state?.user?.photo)
      setUserUpdate({
        ...userUpdate,
        ho:state?.user?.ho,
        ten:state?.user?.ten,
        sdt:state?.user?.sdt,
        email:state?.user?.email,
        gioitinh:state?.user?.gioitinh,
        photo:state?.user?.photo,
        diachi:state?.user?.diachi
      })

    },[state])
    const handleSubmit = async()=>{
      try { 
         const dataUpdate = {
             ...userUpdate,
             photo:image
         }
         const res = await userApi.updateAccountNhanvien(dataUpdate)
         alert('Update successfully !!!')
         window.location.reload()
      } catch (error) {
        console.log(error)
        alert('Update failed !!!')
      }
    }
    const handleChangePass = (e)=>{
        setNewPass(e.target.value)
    }
    const handleInputChange = (e)=>{
      const {name, value} = e.target;
        setUserUpdate({
            ...userUpdate,
            [name]:value
        })
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
                <div className="card-header bg-primary text-white">Account Setting</div>
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
              <input type="text" className="form-control mb-2 mr-sm-2 mt-2" value={userUpdate?.diachi} placeholder = "Enter your address" name="diachi" onChange={handleInputChange}/>
            

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
                <button type="button" className="btn btn-info mr-4 mt-4" data-dismiss="modal" onClick={()=>setChangePass(true)}>Thay đổi mật khẩu</button>
                <button type="button" className="btn btn-outline-info mt-4" data-dismiss="modal" onClick={handleSubmit} >Lưu thay đổi</button>
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
