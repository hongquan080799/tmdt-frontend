import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListCtps = async (maphieu)=>{
    const url = "/ctps"
    const params = {
        maphieu
    }
    try {
        const response = await axiosClient.get(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}

export const insertCtps = async (ctps)=>{
    const url = "/ctps"
    try {
        const response = await axiosClient.post(url, ctps, { headers})
        return response
    } catch (error) {
        throw error
    }
}

export const updateCtps = async (ctps) =>{
    const url = "/ctps"
    try {
        const response = await axiosClient.put(url, ctps, { headers})
        return response
    } catch (error) {
        throw error
    }
}

export const deleteCtps = async (params) =>{ //maphieu masp
    const url = "/ctps"
    try {
        const response = await axiosClient.delete(url ,{params, headers})
        return response
    } catch (error) {
        throw error
    }
}