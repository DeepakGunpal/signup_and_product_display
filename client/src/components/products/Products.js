import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../config';
import { MdFavorite } from 'react-icons/md';
import { IconButton } from '@mui/material';
import './Products.css';

const Products = ({ favorite, setAlert, setAlertMsg, addFav, setnPages, currentPage }) => {
    const [productList, setProductList] = useState([]); //todo productList
    const [recordsPerPage] = useState(3); //todo recordsPerPage

    //todo pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = productList.slice(indexOfFirstRecord, indexOfLastRecord);
    setnPages(Math.ceil(productList.length / recordsPerPage));

    useEffect(() => {
        //todo fetch all products
        const products = async () => {
            const res = await axiosInstance.get(`/getProducts`)
                .catch((err) => {
                    setAlertMsg("error: " + err.response.data.message);
                    setAlert(true);
                })
            if (res && res.status === 200) setProductList(res.data.data);
        }
        products();
    }, [favorite, setAlertMsg, setAlert])

    return (
        <div className='products_list_container'>
            {
                currentRecords && currentRecords.map((product, i) => (
                    <div key={i} className='product_container'>
                        <h4>{product.title}</h4>
                        <h4>Rs. {product.price}/-</h4>
                        <h5>{product.status}</h5>
                        <IconButton aria-label="add" onClick={() => addFav(product._id, true)}>
                            <MdFavorite />
                        </IconButton>
                    </div>
                ))
            }
        </div>
    )
}

export default Products