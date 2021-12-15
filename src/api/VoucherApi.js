import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListVoucher =async ()=>{
    const url = "/voucher"
    try {
        const res = await axiosClient.get(url, {headers})
        return res
    } catch (error) {
        throw error
    }
}

export const getListVoucherWithSort =async (sortField, sortType)=>{
    const params = {
        sortField,
        sortType
    }
    const url = "/voucher"
    try {
        const res = await axiosClient.get(url, {headers, params})
        return res
    } catch (error) {
        throw error
    }
}

export const checkVoucher = async (voucherId)=>{
    const url = "/checkVoucher"
    const params = {
        voucherId 
    }
    try {
        const res = await axiosClient.get(url, {headers, params})
        return res
    } catch (error) {
        throw error
    }
}

export const insertVoucher = async (voucher) =>{
    const url = "/voucher"
    try {
        const res = await axiosClient.post(url, voucher, {headers})
        return res
    } catch (error) {
        throw error
    }
}

export const deleteVoucher = async(voucherId) =>{
    const url = "/voucher"
    const params = {
        voucherId
    }
    try {
        const res = await axiosClient.delete(url, {headers, params})
        return res
    } catch (error) {
        throw error
    }
}