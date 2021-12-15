import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}


export const order = async (donhang)=>{
    const url = "/donhang"
    try {
        const response = await axiosClient.post(url, donhang, {headers} )
        return response
    } catch (error) {
        throw error
    }
}


export const orderPaypal = async (donhang, payerId)=>{
    const params = {
        payerId
    }
    const url = "/donhang"
    try {
        const response = await axiosClient.post(url, donhang, {headers, params} )
        return response
    } catch (error) {
        throw error
    }
}
export const checkVoucher = async(voucherId)=>{
    const params = {
        voucherId
    }
    const url = "/checkVoucher"
    try {
        const res = await axiosClient.get(url, {headers, params})
        return res
    } catch (error) {
        console.log(error)
    }
}

export const getListOrder = async()=>{
    const url = '/donhang'
    try {
        const response = await axiosClient.get(url, {headers})
        return response
    } catch (error) {
        throw error
    }
}
export const getListOrderBySort = async(sortField, sortType)=>{
    const params = {
        sortType,
        sortField
    }
    const url = '/donhang'
    try {
        const response = await axiosClient.get(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getListOrderByKhachhang = async()=>{
    const url = '/donhang/khachhang'
    try {
        const response = await axiosClient.get(url, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const updateStatus = async ({madh, trangthai})=>{
    const url = "/donhang"
    const params ={
        madh,
        trangthai
    }
    try {
        const response = await axiosClient.put(url, {},{params, headers})
        return response
    } catch (error) {
        throw error
    }
}