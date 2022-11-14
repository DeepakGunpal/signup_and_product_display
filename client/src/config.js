import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://dgsignuppage.herokuapp.com/api/'
})