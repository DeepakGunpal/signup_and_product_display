import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { axiosInstance } from '../../config';
import { CgLogOut } from 'react-icons/cg';
import { MdDelete, MdFavorite } from 'react-icons/md';
import UserDetails from '../../components/userDetails/UserDetails';
import { IconButton } from '@mui/material';
import AddProduct from '../../components/addProduct/AddProduct';
import CustomizedSnackbars from '../../components/Snackbar';

const HomePage = ({ setLoginUser }) => {
  const [productList, setProductList] = useState([]);
  const [favList, setFavList] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const navigate = useNavigate();
  //todo logout and remove cookies
  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('jwt');
    setLoginUser(null);
    navigate('/');
  }
  //todo fetch favorite products
  const fav = async () => {
    const res = await axiosInstance.get(`/getFavourites/${Cookies.get('user')}`)
      .catch((err) => {
        setAlertMsg("error: " + err.response.data.message);
      })
    if (res && res.status === 200) setFavList(res.data.data.favourites);
  }

  //todo fetch all products
  const products = async () => {
    const res = await axiosInstance.get(`/getProducts`)
      .catch((err) => {
        setAlertMsg("error: " + err.response.data.message);
      })
    if (res && res.status === 200) setProductList(res.data.data);
  }

  //todo switch tabs
  const favTab = () => setFavorite(true);
  const productTab = () => setFavorite(false);

  //todo add or remove product from favorites
  const addFav = async (productId, product) => {
    const res = await axiosInstance.put(`/update/${Cookies.get('user')}`, { productId, product }, { headers: { Token: Cookies.get('jwt') } })
      .catch((err) => {
        setAlertMsg("error: " + err.response.data.message);
        setAlert(true);
      })
    if (res && res.status === 200) {
      setFavorite(prev => !prev)
      if (product) {
        setAlertMsg('success: Added to favorites');
        setAlert(true)
      };
    };
  }

  useEffect(() => {
    products();
    fav();
  }, [favorite])

  return (
    <div className='homepage_main_container'>
      <UserDetails setLoginUser={setLoginUser} />
      <div className='user_list_container'>
        <CustomizedSnackbars alert={alert} setAlert={setAlert} alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
        <div className='product_container'>
          <h3 onClick={productTab}>Products</h3>
          <h3 onClick={favTab}>Favourites</h3>
        </div>
        {/* //todo show product list */}
        {
          !favorite && productList && productList.map((product, i) => (
            <div key={i} className='product_container'>
              <h4>{product.title}</h4>
              <h4>{product.price}</h4>
              <h5>{product.status}</h5>
              <IconButton aria-label="add" onClick={() => addFav(product._id, true)}>
                <MdFavorite />
              </IconButton>
            </div>
          ))
        }
        {/* //todo show favorite product list */}
        {
          favorite && favList && favList.map((product, i) => (
            <div key={i} className='product_container'>
              <h4>{product.productId.title}</h4>
              <h4>{product.productId.price}</h4>
              <h5>{product.productId.status}</h5>
              <IconButton aria-label="delete" onClick={() => addFav(product.productId._id, false)}>
                <MdDelete />
              </IconButton>
            </div>
          ))
        }
      </div>
      <button onClick={logout} className='logout_btn_container'>{<CgLogOut size='30px' />} <p>Logout</p> </button>
      <AddProduct alert={alert} setAlert={setAlert} alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
    </div >
  )
}

export default HomePage