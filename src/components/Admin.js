import React,{useState,useEffect,useRef,useContext} from 'react'
import SanphamManagement from './SanphamManagement';
import NhanvienManagement from './NhanvienManagement';
import './Admin.css'
import DanhmucManagement from './DanhmucMamagement';
import { UserContext } from '../context/UserContext';
import { getUser } from '../api/UserApi';
import { useHistory, useParams } from 'react-router-dom';
import KhachhangManagement from './KhachhangManagement';
import OrderMangement from './OrderManagement';
import ViewAccount from './ViewAccountNV';
import PhatsinhManagement from './PhatsinhManagement';
import Thongke from './Thongke';
import CtpsManagement from './CtpsManagement';
export default function Admin() {
    const {pageEnpoint, childEnpoint} = useParams()
    const history = useHistory()
    const [search, setSearch] = useState('')
    const [state,setState] = useContext(UserContext)
    const getUserInfo = async ()=>{
        try {
            const user = await getUser()
            if(user?.quyen == 'KHACHHANG'){
                history.push('/')
            }
            await setState({user})
        } catch (error) {
            console.log(error)
            history.push('/')
        }
    }
    useEffect(async ()=>{
        await getUserInfo()
    },[])
    const logout = ()=>{
        window.localStorage.removeItem('jwt')
        setState({})
        history.push('/')
    }

    const [on,setOn] = useState(false);
    const slideRef = useRef(null)
    const handleOn=()=>{
        setOn(!on);
        slideRef.current.classList.toggle("dashboard-on");
        
    }
    const getPage = ()=>{
        let page;
        switch(pageEnpoint){
            case 'index' :{
                page =  <SanphamManagement search={search}/>
                break;
            }
            case 'sanpham':{
                page =  <SanphamManagement search={search}/>
                break;
            }
            case 'danhmuc':{
                page = <DanhmucManagement search={search}/>
                break;
            }
            case 'khachhang':{
                if(state?.user?.quyen === 'ADMIN')
                    page = <KhachhangManagement search={search}/>
                break;
            }
            case 'nhanvien':{
                if(state?.user?.quyen === 'ADMIN')
                    page = <NhanvienManagement search={search}/>
                break;
            }
            case 'donhang':{
                page = <OrderMangement search={search}/>
                break
            }
            case 'thongke':{
                page = <Thongke />
                break
            }
            case 'phatsinh':{
                if(childEnpoint == null)
                    page = <PhatsinhManagement />
                else 
                     page = <CtpsManagement maphieu = {childEnpoint}/>
                break;
            }
            case 'accountSetting':{
                page = <ViewAccount />
            }
        }
        return page
    }
    return (
        <div className="admin">
            <div className="dashboard" ref={slideRef}>
                <p className={on?"dashboard__admin dashboard__admin-on":'dashboard__admin'}><span className="dashboard__admin-icon"><i className="fas fa-users-cog"></i></span> {!on?'ADMIN PAGE':''}</p>
                <hr className="hr-custom"/>
                <p className={on?'dashboard__item dashboard__item-on active':'dashboard__item active'} onClick = {()=> history.push('/admin/sanpham')} >
                    <span className="dashboard__item-icon"><i className="fas fa-list-alt"></i></span> {!on?'Product List':''}
                </p>
                <hr className="hr-custom"/>
                <p className={on?'dashboard__item dashboard__item-on active':'dashboard__item active'} onClick = {()=> history.push('/admin/danhmuc')} >
                    <span className="dashboard__item-icon"><i class="fas fa-th-list"></i></span> {!on?'Category List':''}
                </p>
                {state?.user?.quyen === 'ADMIN'?
                    <div>
                        <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/khachhang')}>
                            <span className="dashboard__item-icon"><i className="fas fa-user" ></i></span> {!on?'Customer Management':''}
                        </p>
                        <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/nhanvien')}>
                            <span className="dashboard__item-icon"><i className="fas fa-user-friends"></i></span> {!on?'Employee Management':''}
                        </p>
                    </div>:''
                 }
                <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/donhang')}>
                    <span className="dashboard__item-icon"><i className="fas fa-wallet"></i></span> {!on?'Order List':''}
                </p>
                <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/phatsinh')}>
                    <span className="dashboard__item-icon"><i class="fas fa-clipboard-list"></i></span> {!on?'Incurred List':''}
                </p>
                <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/thongke')}>
                    <span className="dashboard__item-icon"><i className="fas fa-chart-area"></i></span> {!on?'Chart':''}
                </p>
                {state?.user?.quyen === 'NHANVIEN'?
                    <div>
                        <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick = {()=> history.push('/admin/accountSetting')}>
                            <span className="dashboard__item-icon"><i class="fas fa-cogs"></i></span> {!on?'Account Setting':''}
                        </p>
                    </div>:''
                 }
                <p className={on?'dashboard__item dashboard__item-on':'dashboard__item'} onClick={logout}>
                    <span className="dashboard__item-icon"><i class="fas fa-sign-out-alt"></i></span> {!on?'Logout':''}
                </p>
                <div className={on?"dashboard__utils-on":'dashboard__utils'} onClick={handleOn}> &#60; </div>
            </div>
            <div className={on?"playground playground-on":'playground'}>
                <div className="playground__top">
                    <p className="playground__top__header"><span className="playground__top__header-icon" ><i className="fas fa-smile-wink"></i></span> HAPPY BIRD</p>
                    <div className="find-admin">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="Search" onChange ={(e)=> setSearch(e.target.value)}/>
                            <div className="input-group-append">
                                <button className="btn btn-info" type="submit"><i className="fas fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                    <div className="playground__user"><p className="playground__user-name">{state?.user?.displayname} <span className="playground__user-img"><img src={state?.user?.photo != null? state?.user?.photo :"https://img.icons8.com/fluent/96/000000/user-male-circle.png"} alt="pt" /></span></p></div>
                </div>
                <div className="playground__bottom mt-4 ml-4 mr-4">
                    {getPage()}
                    
                </div>
            </div>
        </div>
    )
}
