import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { axiosInstance } from '../../config';
import { CgLogOut } from 'react-icons/cg';
import UserDetails from '../../components/userDetails/UserDetails';

const HomePage = ({ setLoginUser }) => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove('user');
    Cookies.remove('jwt');
    setLoginUser(null);
    navigate('/');
  }
  const users = async () => {
    const res = await axiosInstance.get('/users')
      .catch((err) => {
        window.alert(err.response.data.message);
      })
    if (res && res.status === 200) setUserList(res.data.data);
  }

  useEffect(() => {
    users()
  }, [])

  return (
    <div className='homepage_main_container'>
      <UserDetails setLoginUser={setLoginUser} />
      <div className='user_list_container'>
        <div className='user_container'>
          <h4>Name</h4>
          <h3>Users</h3>
          <h5>Email</h5>
        </div>
        {
          userList && userList.map((user => (
            <div key={user._id} className='user_container'>
              <h4>{user.firstName + ' ' + user.lastName}</h4>
              <h5>{user.email}</h5>
            </div>
          )))
        }
      </div>
      <button onClick={logout} className='logout_btn_container'>{<CgLogOut size='30px' />} <p>Logout</p> </button>
    </div>
  )
}

export default HomePage