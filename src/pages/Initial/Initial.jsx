import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from '../../components/SignUp/SignUp';
import SignIn from '../../components/SignIn/SignIn';

function Initial() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<SignUp />} />
        <Route exact path='/signin' element={<SignIn />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default Initial;
