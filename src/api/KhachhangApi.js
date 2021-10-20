import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListKH = async()=>{
    const url = "/khachhang"
    try {
        const response = await axiosClient.get(url, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getListKHWithSort = async(sortField, sortType)=>{
    const params = {
        sortField,
        sortType
    }
    const url = "/khachhang"
    try {
        const response = await axiosClient.get(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const deleteKhachhang = async(username)=>{
    const url = "/khachhang"
    const params = {
        username
    }
    try {
        const response = await axiosClient.delete(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getRecoveryCode = async(username)=>{
    const url = "/recovery/send"
    const params = {
        username
    }
    try {
        const response = await axiosClient.get(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const submitRecovery = async(restore)=>{
    const url = "/recovery/submit"
    try {
        const response = await axiosClient.post(url, restore, {headers})
        return response
    } catch (error) {
        throw error
    }
}