import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import * as khachhangApi from '../api/KhachhangApi' 

export default function ForgetPass() {
    const history = useHistory()
    const [username,setUsername] = useState('')
    const [restore,setRestore] = useState(false)
    const [newPass,setNewPass] = useState('')
    const [code,setCode] =useState('')
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            const res = await khachhangApi.getRecoveryCode(username)
            alert('Send verification code to your account successfully !');
            setRestore(true)
        } catch (error) {
            alert('Failed to send email !!!')
            console.log(error)
        }
    }
    const handleRestore = async (e) =>{
        e.preventDefault()
        try {
            const restore = {
                username,
                password:newPass,
                code
            }
            const res = await khachhangApi.submitRecovery(restore)
            alert('Change password successfully !!!')
            history.push('/')
        } catch (error) {
            alert('Change password failed !!!')
            console.log(error)
        }
    }
    return (
        <div>
            {!restore?
            <div className="card mt-4" style={{width: '30rem'}}>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                  <label htmlFor="formGroupExampleInput">Username đã đăng ký</label>
                    <input required={true} type="text" name="username" className="form-control" id="formGroupExampleInput" placeholder="Nhập Username" required onChange={(e)=> setUsername(e.target.value)} value={username}/>
                  </div>
                  <button type="submit" className="btn btn-info">Xác nhận</button>
                </form>
                
              </div>
            </div>:
            <div className="card mt-4" style={{width: '30rem'}}>
            <div className="card-body">
              <form onSubmit={handleRestore}>
                <div className="form-group">
                <label htmlFor="formGroupExampleInput1">Nhập mã xác thực</label>
                  <input required={true} type="text" name="code" className="form-control" id="formGroupExampleInput1" placeholder="Nhập code" required onChange={(e)=> setCode(e.target.value)} value={code}/>
                <label htmlFor="formGroupExampleInput2">Nhập mật khẩu mới</label>
                  <input required={true} type="password" name="password" className="form-control" id="formGroupExampleInput2" placeholder="Nhập mật khẩu mới" required onChange={(e)=> setNewPass(e.target.value)} value={newPass}/>
                </div>
                <button type="submit" className="btn btn-info">Xác nhận</button>
              </form>
              
            </div>
          </div>}
            
        </div>
    )
}
