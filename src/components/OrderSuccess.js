import React,{useEffect, useContext, useState} from 'react'
import { UserContext } from '../context/UserContext'
import { useHistory, useLocation } from 'react-router-dom'
import * as base64 from 'base-64'
import * as donhangApi from '../api/DonhangApi'
import * as emailUtils from '../utils/SendEmail'
import * as utf8 from 'utf8'
import './OrderSuccess.css'
export default function OrderSuccess() {
    const history = useHistory()
    const [state, setState] = useContext(UserContext)
    const [orderConfirm, setOrderConfirm] = useState()
    const search = useLocation().search
    useEffect(async()=>{
        if(state == null) 
            history.push('/')   
        else{
            if(search != null){
                const extraData = new URLSearchParams(search).get('extraData');
                setOrderConfirm(utf8.decode(base64.decode(extraData)))
                const orderRequest = JSON.parse(utf8.decode(base64.decode(extraData)))
                // const ghnResponse = await ghnApi.getOrderGHN(order, state?.user, getShipAddressToGHN(), getPrice())
                // customOrder.madhGhn = ghnResponse?.data?.order_code

                if(orderRequest?.httt == 1){
                    const payerId = new URLSearchParams(search).get('PayerID')
                    await donhangApi.orderPaypal(orderRequest, payerId)
                    alert('order successfully !')
                    const myMessage = emailUtils.getMessageOrder(state?.user, orderRequest?.listSP, getShipAddress)
                    emailUtils.sendEmail(myMessage, state?.user)
                    return
                }
                if(orderRequest?.httt == 2){
                    await donhangApi.order(orderRequest)
                    alert('Order successfully !!!')
                    const myMessage = emailUtils.getMessageOrder(state?.user, orderRequest?.listSP, getShipAddress)

                    emailUtils.sendEmail(myMessage, state?.user)
                }
            }
        }
    },[state])
    const getShipAddress = ()=>{
        if(state?.user?.listDC != null){
            for(let i = 0 ; i< state?.user?.listDC?.length ; i++){
                if(state?.user?.listDC[i]?.isShipAddress){
                    const shipAdd = state?.user?.listDC[i]
                  return shipAdd.addressDetail + ', ' + shipAdd.wardName + ', ' + shipAdd.districtName + ', ' + shipAdd.provinceName
              }
            }
        }
        else{
            return <p className="text-info shipTo__change">Add shiping address</p>
        }
    }

    const getShipAddressToGHN = ()=>{
        if(state?.user?.listDC != null){
            for(let i = 0 ; i< state?.user?.listDC?.length ; i++){
                if(state?.user?.listDC[i]?.isShipAddress){
                    const shipAdd = state?.user?.listDC[i]
                  return {
                      district:shipAdd?.districtId,
                      ward:shipAdd?.wardCode,
                      address:shipAdd?.addressDetail
                  }
              }
            }
        }
    }
    return (
        <div className="order-success-container">
            <div class="jumbotron">
                <h1>Order successfully</h1>
                <div>
                    <p>Your order have been confirm successfully</p>
                    <button className="btn btn-success" type="button" onClick={()=> history.push('/')}>Home <i class="fa fa-home" aria-hidden="true"></i></button>
                </div>
            </div>
        </div>
    )
}
