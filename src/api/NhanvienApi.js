import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListNV = async ()=>{
    const url = "/nhanvien"
    try {
        const response = await axiosClient.get(url, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const getListNVWithSort = async (sortField, sortType)=>{
    const params = {
        sortType,
        sortField
    }
    const url = "/nhanvien"
    try {
        const response = await axiosClient.get(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const insertNV = async(nhanvien)=>{
    const url = "/nhanvien"
    try {
        const response = await axiosClient.post(url, nhanvien, {headers})
        return response
    } catch (error) {
        throw error
    }
}
export const deleteNV = async(username)=>{
    const url = '/nhanvien'
    const params = {
        username
    }
    try {
        const response = await axiosClient.delete(url,{params, headers})
        return response
    } catch (error) {
        throw error
    }
}