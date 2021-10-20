import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}


export const getDanhmuc = async ()=>{
    const url = "/danhmuc"
    try {
        const response = await axiosClient.get(url);
        return response
    } catch (error) {
        throw error
    }
}

export const postDanhmuc = async (danhmuc)=>{
    const url = "/danhmuc"
    try {
        const response = await axiosClient.post(url, danhmuc, {headers})
        return response
    } catch (error) {
        throw error
    }
}

export const updateDanhmuc = async (danhmuc)=>{
    const url = "/danhmuc"
    try {
        const response = await axiosClient.put(url, danhmuc, {headers})
        return response
    } catch (error) {
        throw error
    }
}
export const deleteDanhmuc = async (madm)=>{
    const url = "/danhmuc"
    const params = {
        madm
    }
    try {
        const response = await axiosClient.delete(url, {params, headers})
        return response
    } catch (error) {
        throw error
    }
}