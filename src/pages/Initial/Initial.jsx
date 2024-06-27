import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from '../../components/SignUp/SignUp';
import SignIn from '../../components/SignIn/SignIn';
import SignOut from '../../components/SignOut/SignOut';
import Home from '../Home';

function Initial() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<SignUp />} />
        <Route exact path='/signin' element={<SignIn />} />
        <Route exact path='/signout' element={<SignOut />} />
        <Route exact path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Initial;
