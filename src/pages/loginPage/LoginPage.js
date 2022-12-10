import React, { useState } from 'react'
import './LoginPage.css'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config';
import LoginOTP from './LoginOTP';
import Cookies from 'js-cookie'

const LoginPage = ({ setLoginUser }) => {
    const [otpLogin, setOtpLogin] = useState(false);
    const navigate = useNavigate();
    const [userLoginDetails, setUserLoginDetails] = useState({
        userName: "",
        password: "",
    })

    const userLogin = async (data) => {
        const res = await axiosInstance.post('/login', data)
            .catch((err) => { window.alert(err.response.data.message); })
        if (res && res.status === 200) {
            Cookies.set('jwt', res.data.Token, { secure: true, expires: 1 });
            Cookies.set('user', res.data.data._id, { secure: true, expires: 1 });
            setLoginUser(res.data.data._id);
            navigate('/')
        };
    }

    const login = () => {
        const userLoginData = { ...userLoginDetails }
        userLogin(userLoginData);
    };

    const handleLoginChange = ({ target: { name, value } }) => {
        setUserLoginDetails({ ...userLoginDetails, [name]: value })
    };

    const changeLoginMethod = () => setOtpLogin(prev => !prev);

    const goToSignupPage = () => {
        navigate('/signup');
    }

    return (
        <div className='login_form_container'>
            <h1>Login</h1>
            {
                otpLogin ? <LoginOTP setOtpLogin={setOtpLogin} setLoginUser={setLoginUser} /> : <div className='login_form'>
                    <TextField id="standard-basic" label="UserName" name='userName' variant="standard" onChange={handleLoginChange} />
                    <TextField id="standard-basic" label="Password" name='password' variant="standard" onChange={handleLoginChange} />
                    <br />
                    <div style={{ display: 'flex', marginLeft: '13%' }}>
                        <Button variant="outlined" style={{ backgroundColor: 'rgb(28, 23, 23)', color: 'wheat', fontSize: 'large' }} onClick={login}>Login Now</Button>
                    </div>
                    <div className='other_options_container'>
                        <p onClick={changeLoginMethod}>Login with OTP.</p>
                        <p onClick={goToSignupPage}>Don't have an account?<br /> Create Now.</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default LoginPage