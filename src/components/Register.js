import React,{useState, useEffect} from 'react'
import './Register.css'
import firebase from 'firebase'
import {store} from '../firebase'
import * as userApi from '../api/UserApi'
import { useHistory } from 'react-router-dom'
import * as ghnApi from '../api/GhnApi'
export default function Register() {
    const [image,setImage] = useState("https://img.icons8.com/material-sharp/96/000000/user-male-circle.png")
    const [progress,setProgress] =useState(0)
    const [register,setRegister] = useState({})
    const [diachi, setDiachi] = useState({})
    useEffect(async ()=>{
        try {
            const province = await ghnApi.getProvince();
            setDiachi({province:province.data})
        } catch (error) {
            console.log(error)
        }
    },[])

    const loadDistrict = async (provinceID)=>{
        try {
            const district = await ghnApi.getDistrict(provinceID)
            setDiachi({...diachi,district:district.data });
        } catch (error) {
            throw error
        }
    }

    const loadWard = async (districtID)=>{
        try {
            const ward = await ghnApi.getWard(districtID)
            setDiachi({...diachi,ward:ward.data });
        } catch (error) {
            throw error
        }
    }
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
        
       // console.log(image)
    }
    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        if(name === 'province'){
            loadDistrict(Number(value))
            const province = diachi?.province?.filter(pv => pv.ProvinceID == value)[0]
            let listDC = register.listDC?register.listDC:[]
            
            listDC[0] = {
                ...listDC[0],
                provinceId:province?.ProvinceID,
                provinceName:province?.ProvinceName,
            }
            setRegister({
                ...register,
                listDC
            })
            return;
        }
        if(name === 'district'){
            loadWard(Number(value))
            const district = diachi?.district?.filter(pv => pv.DistrictID == value)[0]
            let listDC = register.listDC?register.listDC:[]
            listDC[0] = {
                ...listDC[0],
                districtId:district?.DistrictID,
                districtName:district?.DistrictName,
            }
            setRegister({
                ...register,
                listDC
            })
            return
        }
        if(name === 'ward'){
            const ward = diachi?.ward?.filter(pv => pv.WardCode == value)[0]
            let listDC = register.listDC?register.listDC:[]
            listDC[0] = {
                ...listDC[0],
                wardCode:ward?.WardCode,
                wardName:ward?.WardName,
            }
            setRegister({
                ...register,
                listDC
            })
            return
        }
        if(name === 'addressDetail'){
            let listDC = register.listDC?register.listDC:[]
            listDC[0] = {
                ...listDC[0],
                [name]:value
            }
            setRegister({
                ...register,
                listDC
            })
            return
        }
        setRegister({
            ...register,
            [name]:value
        })
    }
    const handleSubmid = async (e)=>{
        e.preventDefault()
        const data = {...register};
        if(data.password != data.rePassword){
            alert('Password is not matched !!!')
            return
        }
        delete data.rePassword
        data.photo = image
        console.log(data)
        try {
            await userApi.getRegister(data)
            alert('Your account have created successfully !!!\n Please verify your account by link have been sent to your email')
        } catch (error) {
            alert('Your account failed to created !!!')
        }
    }
    const history =  useHistory()
    return (
        <div className="myRegisterContainer">
            <div className="register-container">
                <div className="myRC">
                    <div className="register-container__left">
                        <div className="register-left">
                        <img src="https://img.icons8.com/color/100/000000/fenix.png"/>    
                            <p className="left-text text-danger">
                                NOTHING IS IMPOSIBLE
                            </p>
                        </div>
                    </div>
                    <div className="register-container__right">
                        <form>
                            <p className="register__head">
                                REGISTER
                            </p>
                            <input type="text" className="form-control" placeholder="Enter your username" name="username" onChange={handleInputChange}  />
                            <div className="form-inline d-flex justify-content-between">
                                <input type="password" className="form-control" placeholder="Enter your password" name="password" onChange={handleInputChange} />
                                <input type="password" className="form-control" placeholder="Re-enter your password" name="rePassword" onChange={handleInputChange}  />
                            </div>
                            <input type="text" className="form-control" placeholder="Enter your first name" name="ten" onChange={handleInputChange}  />
                            <input type="text" className="form-control" placeholder="Enter your last name" name="ho" onChange={handleInputChange}  />
                            <input type="text" className="form-control" placeholder="Enter your phone number" name="sdt" onChange={handleInputChange} />
                            <input type="text" className="form-control" placeholder="Enter your email" name="email" onChange={handleInputChange} />
                            {/* <input type="text" className="form-control" placeholder="Enter your address" name="diachi" onChange={handleInputChange} /> */}
                            
                            <div className="form-inline d-flex justify-content-between">
                                <select className="custom-select my-1 mr-sm-2"  style={{width:'30%'}} name="province" onChange={handleInputChange}>
                                    <option>Province </option>
                                    {diachi?.province?.map(value =>{
                                        return(
                                            <option value={value.ProvinceID}>{value.ProvinceName}</option>
                                        )
                                    })}
                                </select>
                                <select className="custom-select my-1" style={{width:'30%'}} name="district" onChange={handleInputChange}>
                                    <option>District</option>
                                    {diachi?.district?.map(value =>{
                                        return(
                                            <option value={value.DistrictID}>{value.DistrictName}</option>
                                        )
                                    })}
                                </select>
                                <select className="custom-select my-1" style={{width:'30%'}} name="ward" onChange={handleInputChange}>
                                    <option>Ward</option>
                                    {diachi?.ward?.map(value =>{
                                        return(
                                            <option value={value.WardCode}>{value.WardName}</option>
                                        )
                                    })}
                                </select>
                                
                            </div>
                            <input type="text" className="form-control" placeholder="Enter your address" name="addressDetail" onChange={handleInputChange} />
                            <select className="custom-select my-1 mr-sm-2" placeholder="Select your gender" name="gioitinh" onChange={handleInputChange} >
                            <option selected value={0}>Male</option>
                            <option value={1}>Female</option>
                            <option value={2}>Something else</option>
                            </select>
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

                                <input id="file-input" type="file" className="mb-3" onChange={handleImage}/>
                            </div>
                            <div className="row mb-3">
                                <div className="col-12 col-sm-12 col-md-4 col-lg-3 text-center">
                                    <img alt="pt" src={image} className="input-img mb-4" style={{width:150}} />
                                </div>  
                            </div>

                            <button className="register__button" type="submit" onClick={handleSubmid}>Register</button>
                            <hr/>
                            <hr/>
                            <div className="text-center">
                                <a href="#" className="custom-link">Already have an account? Sign in now !</a><br/>
                                <a href="#" className="custom-link">Forgot password</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
