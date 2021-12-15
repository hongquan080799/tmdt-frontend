
// var partnerCode = "MOMO2UJZ20211029";
// var accessKey = "CQa1FkkA8e33QSt3";
// var secretkey = "z8hEjewuB94MkGTq6GcPlOhEh8gjNhQs";
// var requestId = 'MM1540456472574';
// var orderId = 'tranhongquan004';
// var orderInfo = "SDK team.";
// var redirectUrl = "https://localhost:3000/product/SP19112715";
// var ipnUrl = "https://localhost:3000/product/SP19112715";
// // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
// var amount = "150000";
// var requestType = "captureWallet"
// var extraData = ""; //pass empty value if your merchant does not have stores

import axios from "axios";
import axiosClient from "../api/AxiosClient";
import * as crypto from 'crypto-js'
import * as base64 from 'base-64'
import * as utf8 from 'utf8'



// //before sign HMAC SHA256 with format
// //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
// var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
// //puts raw signature
// console.log("--------------------RAW SIGNATURE----------------")
// console.log(rawSignature)
// //signature
// var signature = crypto.createHmac('sha256', secretkey)
//     .update(rawSignature)
//     .digest('hex');
// console.log("--------------------SIGNATURE----------------")
// console.log(signature)





// //rem = 'partnerCode=MOMO2UJZ20211029&accessKey=CQa1FkkA8e33QSt3&requestId=MM154045647277&amount=150000&orderId=dh007&orderInfo=SDK team.&returnUrl=https://momo.vn&notifyUrl=https://momo.vn&extraData=email=abc@gmail.com'
// let temp = `accessKey=${accessKey}&amount=${amount}&extraData=
// eyJ1c2VybmFtZSI6ICJtb21vIn0=&ipnUrl=${redirectUrl}&orderId=tranhongquan001&orderInfo=
// ${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}
// &requestId=MM1540456472579&requestType=captureWallet`
// var signature = HmacSHA256(temp, 'z8hEjewuB94MkGTq6GcPlOhEh8gjNhQs');
// console.log('signature : ' + signature);

export const getSignature = async(order, totalPrice, orderId)=>{
    //crypto.randomBytes(20).toString('hex')
    var partnerCode = "MOMO2UJZ20211029";
    var accessKey = "CQa1FkkA8e33QSt3";
    var secretkey = "z8hEjewuB94MkGTq6GcPlOhEh8gjNhQs";
    var requestId =  orderId;
    var orderId = orderId;
    var orderInfo = "Angry Bird order payment";
    var redirectUrl = "https://localhost:3000/orderSuccessed";
    var ipnUrl = "https://localhost:3000/orderSuccessed";
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = totalPrice * 22000;
    var requestType = "captureWallet"
    var extraData = base64.encode(utf8.encode(JSON.stringify(order)))
    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
    //puts raw signature
    // console.log("--------------------RAW SIGNATURE----------------")
    // console.log(rawSignature)
    //signature
    var signature = crypto.enc.Hex.stringify(crypto.HmacSHA256(rawSignature, secretkey))
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    try {
        const data = {
            partnerCode,
            requestType,
            ipnUrl,
            redirectUrl,
            orderId,
            amount,
            lang:'vi',
            orderInfo,
            requestId,
            extraData,
            signature
        }
        //console.log(JSON.stringify(data))
        
        const url = 'https://test-payment.momo.vn/v2/gateway/api/create'
        let jwt = window.localStorage.getItem('jwt');
        let headers = {
            Authorization: 'Bearer ' + jwt
        }
        let params = {
            httt: 2
        }
        const res = await axiosClient.post('/donhang/getPayUrl',data, {headers, params})
        return res
    } catch (error) {
        throw error
     }

}

export const getExtraData = (data)=>{
    return utf8.decode(base64.decode(data))
}