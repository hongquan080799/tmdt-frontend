import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const isEnableRate =async (masp)=>{
    const url = "/rate/isEnableRate"
    const params = {
        masp
    }
    try {
        const response = await axiosClient.get(url, {params, headers})
        if(response.data != null){
            return response.data
        }
        return response
    } catch (error) {
        throw error
    }
}

export const getListRate = async (masp)=>{
    const params = {
        masp
    }
    const url = "/rate/all"
    try {
        const response = await axiosClient.get(url, {params ,headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getRateByKH = async (masp)=>{
    const params = {
        masp
    }
    const url = "/rate"
    try {
        const response = await axiosClient.get(url, {params ,headers})
        if(response.data != null)
          return response.data
        return response
    } catch (error) {
        throw error
    }
}

export const getRating = async (masp, danhgia)=>{
    const data = {
        id:{
            masp,
            makh:''
        },
        khachhang:{
            makh:''
        },
        sanpham:{
            masp
        },
        danhgia

    }
    const url = "rate"
    try {
        const res = await axiosClient.post(url, data, {headers})
        return res
    } catch (error) {
        throw error
    }
}