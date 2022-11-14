import React from 'react'
import './DefaultPage.css'
import { Link } from 'react-router-dom';

const DefaultPage = () => {
    const style = {
        backgroundColor: 'rgb(181, 167, 167)',
        color: 'black',
        fontSize: 'large',
        fontWeight: '600',
        padding: '10px 15px',
        borderRadius: '10px',
        textDecoration: 'none'
    }
    return (
        <div className='main_container'>
            <div className='content_container'>
                <h1>Hello I'm <br /><a href='https://deepakgunpal.com' target='_blank' rel='noreferrer'>Deepak Gunpal</a></h1>
                <div className='defaultpage_button_container'>
                    <Link to='/signup' style={style}>Signup</Link>
                    <Link to='/login' style={style}>Login</Link>
                </div>
            </div>
        </div>
    )
}

export default DefaultPage