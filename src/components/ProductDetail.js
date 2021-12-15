import React,{useEffect, useState , useContext} from 'react'
import RateChart from './RateChart'
import ReactStars from "react-rating-stars-component";
import {useParams} from 'react-router-dom'
import * as sanphamApi from '../api/SanphamApi'
import * as cartApi from '../api/GiohangApi'
import * as rateApi from '../api/RateApi'
import { UserContext } from '../context/UserContext';
import './ProductDetail.css'
export default function ProductDetail() {
    const [sanpham, setSanpham] = useState({})
    const [rate,setRate] = useState({})
    const [dgUser,setDgUser] = useState(0);
    const {masp} = useParams();
    const [state, setState] = useContext(UserContext)
    const [listCart, setListCart] = useState([])
    const [cart, setCart] = useState({
        masp,
        makh:'',
        soluong:1
    })
    const [isRate,setIsRate] = useState(false)
    const handleInputChange = (e) =>{
        const {name,value} = e.target
        if(name == 'soluong'){
            if(value > sanpham?.soluong - getNumCart())
            return
        }
        setCart({
            ...cart,
            [name]:value
        })
    }
    const addToCart = async () => {
        await setCart({
            ...cart,
            masp:sanpham.masp,
            makh:''
        })
        console.log(cart)
        try {
            const response = await cartApi.insertGioHang(cart)
            alert('Add to cart successfully !');
            setCart({
                ...cart,
                soluong:1
            })
            const numCart = await cartApi.getNumCart()
            setState({...state, numCart})
            const data = await cartApi.getGioHangByMakh()
            setListCart(data)
        } catch (error) {
            alert('Add to cart failed')
            console.log(error)
        }

    }
    const ratingChanged = async (danhgia)=>{
        try {
            const res0 = await rateApi.getRating(masp, danhgia)
            const res1 = await rateApi.getListRate(masp);
            setRate(res1)
            const res2 = await rateApi.getRateByKH(masp)
                setDgUser(res2)
        } catch (error) {

            console.log(error)
        }
    }
    useEffect(async()=>{
        try {
            const res = await rateApi.getListRate(masp);
            setRate(res)
            const data = await cartApi.getGioHangByMakh()
            setListCart(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    },[])
    useEffect(async()=>{
        try {
            const data = await sanphamApi.getSanpham(masp)
            setSanpham(data)
            if(state?.user){
                const res = await rateApi.isEnableRate(masp)
                setIsRate(res)
                console.log(res)

                const res2 = await rateApi.getRateByKH(masp)
                setDgUser(res2)
            }
        } catch (error) {
            console.log(error)
        }
    },[state])
    const getNumCart = ()=>{
        let num = 0;
        listCart?.forEach(c =>{
            if(cart?.masp == c?.sanpham?.masp)
                num = c.soluong
        })
       return num
    }
    return (
        <div className="productDetail">
            {getNumCart()}
            <div className="row">
                <div className="col-6">
                    <h5 className="productDetail_head">Samsung Galaxy Note 10</h5>
                   
                </div>
                <div className="col-6">
                    {isRate?<ReactStars
                                count={5}
                                onChange={ratingChanged}
                                size={30}
                                value={dgUser}
                                emptyIcon={<i className="far fa-star"></i>}
                                halfIcon={<i className="fa fa-star-half-alt"></i>}
                                fullIcon={<i className="fa fa-star"></i>}
                                activeColor="#ffd700"
                    />:''}
                </div>
                <div className="col-12">
                     <hr/>
                </div>
                <div className="col-4">
                <div id="demo" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        {sanpham?.listHA?.map((ha,index) =>{
                        return(
                            <div class={ index===0 ? 'carousel-item active' : 'carousel-item'} key={index}>
                            <img src={ha.photo} alt="Los Angeles" style={{width:'100%'}}/>
                            </div>
                        )
                        })}
                    </div>

                    <a class="carousel-control-prev " href="#demo" data-slide="prev">
                        <span class="carousel-control-prev-icon navi-icon"></span>
                    </a>
                    <a class="carousel-control-next" href="#demo" data-slide="next">
                        <span class="carousel-control-next-icon navi-icon"></span>
                    </a>

                    </div>
                </div>
                <div className="col-2"></div>
                <div className="col-6">
                    <h3>{sanpham?.tensp}</h3>
                    <h4 className="text-danger">{sanpham?.dongia} $</h4>
                    <hr/>
                    <div className="row">
                        <div className="col-6">
                            <p>Danh mục</p>
                        </div>
                        <div className="col-6 text-right">
                            <p>{sanpham?.danhmuc?.tendm}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-6">
                            <p>Mô tả ngắn</p>
                        </div>
                        <div className="col-6 text-right">
                            <p>{sanpham?.mota_ngan}</p>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-6">
                            <p>Hàng trong kho</p>
                        </div>
                        <div className="col-6 text-right">
                            {sanpham?.soluong != 0?<p>Còn : {sanpham?.soluong}</p>:<p>Hết hàng</p>}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-6">
                            <input type="number" className="form-control" min="1" name="soluong" onChange={handleInputChange} value={cart?.soluong} max={sanpham?.soluong - getNumCart()} disabled={sanpham?.soluong == 0 || (sanpham?.soluong)<=0 || getNumCart() >= sanpham?.soluong}  />
                        </div>
                        <div className="col-6">
                            <button disabled={sanpham?.soluong == 0 || (sanpham?.soluong)<=0 || getNumCart() >= sanpham?.soluong} onClick={addToCart} className="btn btn-success" ><i className="fa fa-shopping-cart" aria-hidden="true"></i> Add to card</button>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <RateChart 
                            key={sanpham.masp}
                            five = {rate?.five}
                            one = {rate?.one}
                            two = {rate?.two}
                            three = {rate?.three}
                            four = {rate?.four}
                            
                            soluong = {rate?.soluong}
                        />
                 </div>
                <div className="col-6 toggle-nav">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#home">Chi tiết</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#menu1">Thông tin thanh toán</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#menu2">Đánh giá khách hàng</a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane container active text-secondary" id="home">{sanpham?.mota_chitiet} dsdsd</div>
                    <div className="tab-pane container fade text-secondary" id="menu1">
                        <h6> - Thanh toán bằng tiền mặt</h6>
                        <img src="https://s.marketwatch.com/public/resources/images/MW-IE698_stimul_ZG_20200417141427.jpg" style={{width:'80%'}} />
                        <h6 className="mt-4"> - Thanh toán online</h6>
                        <img src="https://cdn.tgdd.vn/Files/2019/07/16/1179841/636629240000820088-760x367.jpg" style={{width:'80%'}}/>
                    </div>
                    <div className="tab-pane container fade" style={{color:'black'}} id="menu2">
                        <div className="row">
                            <div className="col-12 mb-4">
                                {/* <p>0 Bình luận</p>
                                <hr></hr> */}
                                <div class="fb-comments" data-href={"https://developers.facebook.com/" + masp} data-width="" data-numposts="5"></div>
                             </div>
                            {/* <div className="col-2 mt-4">
                                <img src={quan} alt="picture" style={{width:"90%"}} className="rounded-circle"/>
                            </div>
                            <div className="col-10 mt-4">
                                <textarea className="form-control" rows="4" placeholder="Để lại bình luận của bạn !!!"></textarea>
                            </div> */}
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    )
}
