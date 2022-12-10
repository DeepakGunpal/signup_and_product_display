import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/homePage/HomePage';
import SignupPage from './pages/signupPage/SignupPage';
import LoginPage from './pages/loginPage/LoginPage';
import DefaultPage from './components/defaultPage/DefaultPage';
import { BiHomeSmile } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import Socials from './components/socials/Socials';
import { useState } from 'react';
import Cookies from 'js-cookie'

function App() {
  const [loginUser, setLoginUser] = useState(Cookies.get('user'));
  return (
    <div className="App">
      <BrowserRouter>
        <Link to='/'><h1 className='home_button_container'><BiHomeSmile /></h1></Link>
        <Socials className='socials_container' />
        <Routes>
          <Route exact path='/' element={loginUser ? <HomePage setLoginUser={setLoginUser} /> : <DefaultPage />} />
          <Route exact path='/signup' element={<SignupPage />} />
          <Route exact path='/login' element={<LoginPage setLoginUser={setLoginUser} />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
