import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getGioHangByMakh = async ()=>{
    try {
        const response = await axiosClient.get('/giohang',{headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const insertGioHang = async (giohang)=>{
    const url = "/giohang"
    try {
        const response = await axiosClient.post(url, giohang, {headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const getNumCart = async ()=>{
    try {
        const response = await axiosClient.get('/numCart',{headers})
        if(isNaN(response))
            return response.data
        return response
    } catch (error) {
        throw error
    }
}

export const updateCart = async (giohang)=>{
    const url = "/giohang"
    try {
        const response = await axiosClient.put(url, giohang, {headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const deleteCart = async (masp) =>{
    const url = "/giohang"
    const params = {
        masp
    }
    try {
        const response = await axiosClient.delete(url, {headers, params})
        return response;
    } catch (error) {
        throw error
    }
}
