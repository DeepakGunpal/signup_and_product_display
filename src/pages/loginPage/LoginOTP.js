import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { axiosInstance } from '../../config'
import './LoginPage.css'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const LoginOTP = ({ setOtpLogin, setLoginUser }) => {
    const [displaySendOTP, setDisplaySendOTP] = useState('unset');
    const [displayVerifyOTP, setDisplayVerifyOTP] = useState('none');
    const navigate = useNavigate();
    const [userLoginDetails, setUserLoginDetails] = useState({
        number: "",
        otp: "",
    })

    const sendOTP = async (data) => {
        const res = await axiosInstance.post('/sendOTP', data)
            .catch((err) => {
                window.alert(err.response.data.message);
            })
        if (res && res.status === 200) {
            window.alert(`OTP sent on ${userLoginDetails.number}`)
            setDisplaySendOTP('none')
            setDisplayVerifyOTP('unset')
        };
    }
    const verifyOTP = async (data) => {
        const res = await axiosInstance.post('/verifyOTP', data)
            .catch((err) => {
                window.alert(err.response.data.message);
                if (err.response.data.message !== 'Enter OTP') {
                    setDisplayVerifyOTP('none');
                    setDisplaySendOTP('unset');
                }
            });
        if (res.status === 200) {
            Cookies.set('jwt', res.data.Token, { secure: true, expires: 1 });
            Cookies.set('user', res.data.data._id, { secure: true, expires: 1 });
            setLoginUser(res.data.data._id);
            navigate('/');
        };
    }

    const handleOTPChange = ({ target: { name, value } }) => {
        setUserLoginDetails({ ...userLoginDetails, [name]: value })
    };
    const sendOTP_button = () => {
        const userLoginData = { ...userLoginDetails }
        sendOTP(userLoginData);
    }
    const verifyOTP_button = () => {
        const userLoginData = { ...userLoginDetails }
        verifyOTP(userLoginData);
    }
    const changeLoginMethod = () => setOtpLogin(prev => !prev);

    const goToSignupPage = () => {
        navigate('/signup');
    }

    return (
        <div className='login_form'>
            <TextField id="standard-basic" label="Number" name='number' variant="standard" onChange={handleOTPChange} />
            <TextField id="standard-basic" label="OTP" name='otp' variant="standard" onChange={handleOTPChange} style={{ display: displayVerifyOTP }} />
            <br />
            <div style={{ display: displaySendOTP, marginLeft: '13%' }}>
                <Button variant="outlined" style={{ backgroundColor: 'rgb(28, 23, 23)', color: 'wheat', fontSize: 'large' }} onClick={sendOTP_button}>Send OTP</Button>
            </div>
            <div style={{ display: displayVerifyOTP, marginLeft: '13%' }}>
                <Button variant="outlined" style={{ backgroundColor: 'rgb(28, 23, 23)', color: 'wheat', fontSize: 'large' }} onClick={verifyOTP_button}>verify OTP</Button>
            </div>
            <div className='other_options_container'>
                <p onClick={changeLoginMethod}>Login with Password.</p>
                <p onClick={goToSignupPage}>Don't have an account?<br /> Create Now.
                </p></div>
        </div>
    )
}

export default LoginOTP