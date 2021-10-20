import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListPhatsinh = async()=>{
    const url = "/phatsinh"
    try {
        const response = await axiosClient.get(url, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const insertPhatsinh = async(loai)=>{
    const url = "/phatsinh"
    const params = {
        loai
    }
    try {
        const response = await axiosClient.post(url, {},{params ,headers})
        return response
    } catch (error) {
        throw error
    }
}

export const deletePhatsinh = async(id)=>{
    const url = "/phatsinh"
    const params = {
        id
    }
    try {
        const response = await axiosClient.delete(url ,{params ,headers})
        return response
    } catch (error) {
        throw error
    }
}
