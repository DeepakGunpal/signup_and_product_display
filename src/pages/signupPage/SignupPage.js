import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import './SignupPage.css'
import { Button } from '@mui/material';
import { axiosInstance } from '../../config';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const [displaySignup, setDisplaySignup] = useState('none');
    const navigate = useNavigate();
    const [newUserDetails, setNewUserDetails] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        number: "",
        password: "",
        confirmPassword: ""
    });

    const newUser = async (data) => {
        const res = await axiosInstance.post('/signup', data)
            .catch((err) => {
                window.alert(Object.values(err.response.data.message)[0]);
            })           
        if (res && res.status === 201) {
            window.alert("Registration successful");
            navigate('/login');
        };
    }

    const handleAdd = () => {
        const newUserData = { ...newUserDetails }
        newUser(newUserData);
    };

    const handleChange = ({ target: { name, value } }) => {
        setNewUserDetails({ ...newUserDetails, [name]: value })
    };

    useEffect(() => {
        if (newUserDetails.password !== newUserDetails.confirmPassword) {
            setDisplaySignup('none');
        } else {
            setDisplaySignup('flex');
        }
    }, [newUserDetails])

    const goToLoginPage = () => {
        navigate('/login');
    }

    return (
        <div className='signup_form_container'>
            <h1>Signup</h1>
            <div className='signup_form'>
                <TextField id="standard-basic" label="First Name" name="firstName" variant="standard" onChange={handleChange} />
                <TextField id="standard-basic" label="Last Name" name="lastName" variant="standard" onChange={handleChange} />
                <TextField id="standard-basic" label="UserName" name="userName" variant="standard" onChange={handleChange} />
                <TextField id="standard-basic" label="Number" name="number" variant="standard" onChange={handleChange} />
                <TextField id="standard-basic" label="Email" name="email" variant="standard" onChange={handleChange} /><br />
                <TextField id="standard-basic" label="Password" name="password" variant="standard" onChange={handleChange} />
                <TextField id="standard-basic" label="Confirm Password" name="confirmPassword" variant="standard" onChange={handleChange} />
                <div className='signup_button_container' style={{ display: displaySignup }}>
                    <Button variant="outlined" style={{ backgroundColor: 'rgb(28, 23, 23)', color: 'wheat', fontSize: 'large' }} onClick={handleAdd}>Signup Now</Button>
                </div>
                {
                    displaySignup === 'none' && <p>Password and Confirm Password does not Match !!</p>
                }
                <p onClick={goToLoginPage}>Already have an account? Login here.</p>

            </div>
        </div>
    )
}

export default SignupPage