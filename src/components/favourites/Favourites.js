import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { axiosInstance } from '../../config';
import { MdDelete } from 'react-icons/md';
import { IconButton } from '@mui/material';

const Favourites = ({ addFav, setAlertMsg, setAlert, favorite, currentPage, setnPages }) => {
    const [favList, setFavList] = useState([]); //todo fav productList
    const [recordsPerPage] = useState(3); //todo recordsPerPage

    //todo pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = favList.slice(indexOfFirstRecord, indexOfLastRecord);
    setnPages(Math.ceil(favList.length / recordsPerPage));

    useEffect(() => {
        //todo fetch all fav products
        const fav = async () => {
            const res = await axiosInstance.get(`/getFavourites/${Cookies.get('user')}`)
                .catch((err) => {
                    setAlertMsg("error: " + err.response.data.message);
                    setAlert(true);
                })
            if (res && res.status === 200) setFavList(res.data.data.favourites);
        }
        fav();
    }, [favorite, setAlertMsg, setAlert])

    return (
        <div className='products_list_container'>
            {
                currentRecords && currentRecords.map((product, i) => (
                    <div key={i} className='product_container'>
                        <h4>{product.productId.title}</h4>
                        <h4>Rs. {product.productId.price}/-</h4>
                        <h5>{product.productId.status}</h5>
                        <IconButton aria-label="delete" onClick={() => addFav(product.productId._id, false)}>
                            <MdDelete />
                        </IconButton>
                    </div>
                ))
            }
        </div>
    )
}

export default Favourites