import React,{useEffect, useState} from 'react'
import './Items.css'
import Item from './Item'
import * as sanphamApi from '../api/SanphamApi'
import { useParams } from 'react-router-dom'
export default function Items() {
    const [products, setProducts] = useState([])
    const {madm} = useParams()
    useEffect(async ()=>{
        try {
            if(madm != null){
                const data = await sanphamApi.getSanphamByMadm(madm)
                await setProducts(data)
            }
            else{
                
                const data = await sanphamApi.getListSanpham()
                await setProducts(data)
            }
        } catch (error) {
            console.log(error)
        }
    },[])
    return (
        <div>
            <h3 className='list-item__header'>DANH SÁCH ĐIỆN THOẠI BÁN CHẠY</h3>
            <div className='row text-center'>
                {products.map(product=>{
                    return (
                        <div className='col-sm-12 col-md-6 col-lg-6 col-xl-3'>
                            <Item product = {product} key={product.masp}/>
                        </div>
                    )
                })}
            </div>
            {/* <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className={p  <=0?"page-item disabled":'page-item'}>
                  <a className="page-link" href={'/page/' +Number(p)} >Trang trước</a>
                </li>

                <li className={p>=pageNum -1?"page-item disabled":'page-item'}>
                  <a className="page-link" href={'/page/' +Number(p+2)}>Trang tiếp</a>
                </li>
              </ul>
            </nav> */}
            
            
        </div>
    )
}
