import axiosClient from "./AxiosClient";
let headers = {
    token:'382632fb-ba14-11eb-8546-ca480ac3485e'
}

export const getProvince = ()=>{
    const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province"
    try {
        const response = axiosClient.get(url,{headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getDistrict = (provinceID)=>{
    const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district"
    const data = {
        province_id :  provinceID   
    }
    try {
        const response = axiosClient.post(url, data, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getWard = (districtID)=>{
    const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id"
    const data = {
        district_id :  districtID   
    }
    try {
        const response = axiosClient.post(url,data, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getOrderGHN = async (donhang,user, address, price)=>{
    const url = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create"
    const myItems = donhang?.listSP?.map(sp =>{
        return{
            name:sp.tensp,
            code:sp.masp,
            quantity: Number(sp.soluong),
            price: sp.gia * 22000,
            length: 12,
            width: 12,
            height: 12,
            category: 
            {
                level1:sp.danhmuc?.tendm
            }
        }
    })
    const myOrder = {
        ...ghn,
        items:myItems,
        to_name:user?.displayname,
        to_phone:user?.sdt,
        to_address:address?.address,
        to_ward_code:address?.ward,
        cod_amount:Math.round(price * 22000),
        to_district_id:address?.district
    }
    try {
        console.log(myOrder)
        const response = await axiosClient.post(url, myOrder, {headers})
        return response
    } catch (error) {
        throw error
    }
}

const ghn = {
shop_id:"80020",
to_name:"hongquan",
to_phone:"0336781801",
to_address:"371 Nguyễn kiệm p3 Q.Gò vấp",
to_ward_code:"21305",
to_district_id:1461,
weight:10,
length:10,
width:10,
height:10,
service_type_id:2,
service_id:0,
payment_type_id:2,
required_note:"CHOTHUHANG",
 items: [
     {
         name:"Áo Polo",
         code:"Polo123",
         quantity: 1,
         price: 200000,
         length: 12,
         width: 12,
         height: 12,
         category: 
         {
             level1:"Áo"
         }
     }
     
 ]
}