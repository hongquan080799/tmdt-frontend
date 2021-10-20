import axiosClient from "./AxiosClient";
let jwt = window.localStorage.getItem('jwt');
let headers = {
    Authorization: 'Bearer ' + jwt
}

export const getListSanpham = async ()=>{
    try {
        const list = await axiosClient.get('/sanpham')
        return list
    } catch (error) {
        throw error
    }
}

export const getListSanphamwithSort = async (sortBy, sortType)=>{
    const params = {
        sortBy,
        sortType
    }
    try {
        const list = await axiosClient.get('/sanpham',{params})
        return list
    } catch (error) {
        throw error
    }
}

export const getSanpham = async (masp)=>{
    try {
        const sanpham = await axiosClient.get(`/sanpham/${masp}`)
        return sanpham
    } catch (error) {
        throw error
    }
}

export const insertSanpham = async (sanpham)=>{
    try {
        const response = await axiosClient.post('/sanpham', sanpham, {headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const updateSanpham = async (sanpham)=>{
    try {
        const response = await axiosClient.put('/sanpham', sanpham, {headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const deleteSanpham = async (masp)=>{
    const params = {
        masp
    }
    try {
        const response = await axiosClient.delete('/sanpham',{params, headers})
        return response;
    } catch (error) {
        throw error
    }
}

export const getSanphamByMadm = async (madm)=>{
    const url = `/danhmuc/${madm}`
    try {
        const response = await axiosClient.get(url)
        return response;
    } catch (error) {
        throw error
    }
}