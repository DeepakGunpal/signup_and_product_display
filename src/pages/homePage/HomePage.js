import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { axiosInstance } from '../../config';
import { CgLogOut } from 'react-icons/cg';
import UserDetails from '../../components/userDetails/UserDetails';
import AddProduct from '../../components/addProduct/AddProduct';
import CustomizedSnackbars from '../../components/Snackbar';
import BasicPagination from '../../components/Pagination';
import Products from '../../components/products/Products';
import Favourites from '../../components/favourites/Favourites';

const HomePage = ({ setLoginUser }) => {
  const [favorite, setFavorite] = useState(false); //todo switch tabs
  const [alert, setAlert] = useState(false); //todo show alert message
  const [alertMsg, setAlertMsg] = useState(''); //todo alert message
  const [currentPage, setCurrentPage] = useState(1); //todo pagination
  const [nPages, setnPages] = useState(1); //todo pagination
  const navigate = useNavigate();
  //todo logout and remove cookies
  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('jwt');
    setLoginUser(null);
    navigate('/');
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

  return (
    <div className='homepage_main_container'>
      <UserDetails setLoginUser={setLoginUser} />
      <div className='product_list_container'>
        <CustomizedSnackbars alert={alert} setAlert={setAlert} alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
        <BasicPagination nPages={nPages} setnPages={setnPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className='product_container'>
          <h3 onClick={productTab}>Products</h3>
          <h3 onClick={favTab}>Favourites</h3>
        </div>
        {/* //todo show product list */}
        {!favorite && <Products addFav={addFav} favorite={favorite} setAlert={setAlert} setAlertMsg={setAlertMsg} currentPage={currentPage} nPages={nPages} setnPages={setnPages} />}
        {/* //todo show favorite product list */}
        {favorite && <Favourites addFav={addFav} favorite={favorite} setAlert={setAlert} setAlertMsg={setAlertMsg} currentPage={currentPage} nPages={nPages} setnPages={setnPages} />}
      </div>
      <button onClick={logout} className='logout_btn_container'>{<CgLogOut size='30px' />} <p>Logout</p> </button>
      <AddProduct alert={alert} setAlert={setAlert} alertMsg={alertMsg} setAlertMsg={setAlertMsg} />
    </div >
  )
}

export default HomePage