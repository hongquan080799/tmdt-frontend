import React,{useContext,useState,useEffect} from 'react'
import './Topbar.css'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
import { getUser } from '../api/UserApi'
import { UserContext } from '../context/UserContext'
import { getNumCart } from '../api/GiohangApi'
import MessengerCustomerChat from 'react-messenger-customer-chat';
export default function Topbar() {
    const [state,setState] = useContext(UserContext)
    const [open,setOpen] = useState(false)
    const history = useHistory();
    const getUserInfo = async ()=>{
        try {
            const user = await getUser()
            const numCart = await getNumCart()
            const myState = {
                user,
                numCart
            }
            console.log(myState)
            await setState(myState)
              

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(async ()=>{
        await getUserInfo()
    },[])
    const logout = ()=>{
        window.localStorage.removeItem('jwt')
        setState({})
        window.location.reload()
    }
    const isLogin = ()=>{
        if(state?.user != null ){
            return (
                <div onMouseEnter={()=>setOpen(true)} onMouseLeave={()=> setOpen(false)}>
                    <p className="login item mr-3">{state?.user?.photo?<img alt="pc" className="rounded-circle" src ={state?.user?.photo} style={{height:40}} />:<i className="fa fa-user-circle fa-lg" aria-hidden="true" ></i>} {state?.user?.displayname} </p>
                    {open?
                        <div class="myAccount" style={{zIndex:1}}>
                            <p onClick={()=> history.push('/viewAccount')}><i class="fa fa-user" aria-hidden="true"></i> Thông tin tài khoản</p>
                            <p onClick={()=> history.push('/viewOrder')}><i class="fa fa-shopping-bag" aria-hidden="true"></i> Đơn hàng của tôi</p>
                        </div> :''  
                     }
                </div>
            )
        }
        else
            return (
                <p onClick={()=>{history.push('/login')}} className="login item mr-3"><i className="fa fa-user-circle fa-lg" aria-hidden="true"></i> Đăng nhập</p>
            )
    }
    const isLogout = ()=>{
        if(state?.user != null){            
            return (
                <p className="login item ml-3" onClick={logout}><i class="fas fa-sign-out-alt"></i> Đăng xuất</p>
            )
        }
        else
            return '';
    }
    return (
        
        <div>
            <MessengerCustomerChat
                pageId="575303299345434"
                appId="2594387300854202"
            />
            <div className='d-none d-sm-block'>
                <div className='topbar d-flex justify-content-around'>
                    <div className='topbar__contact d-flex'>              
                        <p className='mr-3'>Hongquan080799@gmail.com</p>
                        <p>0336781801</p>
                    </div>
                    <div className='topbar__more d-flex'>
                        {isLogin()}
                        <Link to='/cart'>
                         <p className="cart item mr-3"><i className="fa fa-shopping-cart fa-lg" aria-hidden="true"></i>{'hongquan'?<span className='index'>{state?.numCart != null?state.numCart:'0'}</span>:''} Giỏ hàng</p>
                        </Link>
                        <p className="login item"><i className="fa fa-bell fa-lg"></i><span className='index'>1</span> Thông báo</p>
                        {isLogout()}
                    </div>
                </div>
            </div>
            <div className='d-block d-sm-none'>
                <div className='topbar d-flex justify-content-around'>
                    <div className='topbar__contact d-flex'>              
                        <p className='mr-3'>Hongquan080799@gmail.com</p>
                        <p>0336781801</p>
                    </div>
                    <div className='topbar__more d-flex'>
                         <p className="login item mr-3"><i className="fa fa-user-circle fa-lg" aria-hidden="true"></i></p>
                        <p className="cart item mr-3"><i className="fa fa-shopping-cart fa-lg" aria-hidden="true"></i><span className='index'>1</span></p>
                        <p className="login item"><i className="fa fa-bell fa-lg"></i><span className='index'>1</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
