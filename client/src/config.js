import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://signupandproducts.herokuapp.com/api/'
})