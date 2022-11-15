import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './AddProduct.css'
import { axiosInstance } from '../../config';
import { MdAdd, MdAddBox, MdCancel } from 'react-icons/md';
import CustomizedSnackbars from '../Snackbar';

export default function AddProduct({ alert, setAlert, alertMsg, setAlertMsg }) {
    const [open, setOpen] = useState(false);

    const [newProductDetails, setNewProductDetails] = useState({
        title: "",
        price: "",
        status: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const newProduct = async (data) => {
        const res = await axiosInstance.post('/createProduct', data)
            .catch((err) => {
                setAlertMsg("error: " + Object.values(err.response.data.message)[0]);
                setAlert(true);
            })
        if (res && res.status === 201) {
            setAlertMsg("success: Product added");
            setAlert(true);
        }
    }

    const handleAdd = () => {
        const newProductData = { ...newProductDetails }
        newProduct(newProductData);
        setNewProductDetails("");
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInput = ({ target: { name, value } }) => {
        setNewProductDetails({ ...newProductDetails, [name]: value })
    };
    return (
        <div className='add_Product_button'>
            <button
                onClick={handleClickOpen}
                className='add_product_btn_container'>
                {<MdAddBox size='30px' />} <span>Add Product</span>
            </button>
            <Dialog open={open} onClose={handleClose}>
                <DialogActions>
                    <Button variant="contained" size='medium' style={{ backgroundColor: 'rgb(28, 23, 23)' }} onClick={handleClose}><MdCancel /></Button>
                </DialogActions>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        style={{ fontSize: '18px', fontWeight: 'bold', color: 'rgb(28, 23, 23)' }}
                    >
                        Important : <br />
                        1.) Feilds marked as * are Mandatory. <br />
                        <CustomizedSnackbars alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
                    </DialogContentText>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: 'large' }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            onChange={handleInput}
                            label="Product Name"
                            name="title"
                            type="text"
                            variant="outlined"
                            autoComplete='off'
                            required
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            onChange={handleInput}
                            label="Price"
                            name="price"
                            type="number"
                            variant="outlined"
                            autoComplete='off'
                            required
                        />
                        <TextField
                            autoFocus
                            select
                            margin="dense"
                            id="name"
                            onChange={handleInput}
                            label="Status"
                            name='status'
                            value={newProductDetails.status}
                            variant="outlined"
                            autoComplete='off'
                            SelectProps={{ native: true }}
                        >
                            <option key='Availabe' value="Availabe">Available</option>
                            <option key='Out Of Stock' value="Out Of Stock">Out of Stock</option>
                        </TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" size='large' style={{ backgroundColor: 'rgb(28, 23, 23)' }} onClick={handleAdd}>Add<MdAdd /></Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}