import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from '../../components/SignUp/SignUp';
import SignIn from '../../components/SignIn/SignIn';
import SignOut from '../../components/SignOut/SignOut';
import Employees from '../../components/Employees';
import Vacations from '../../components/Vacations';
import MergedTable from '../../components/MergedTable/MergedTable';
import Home from '../Home';
import { AuthProvider } from '../../context/AuthContext';

function Initial() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<SignUp />} />
          <Route exact path='/signin' element={<SignIn />} />
          <Route exact path='/signout' element={<SignOut />} />
          <Route exact path='/home' element={<Home />} />
          <Route exact path='/employees' element={<Employees />} />
          <Route exact path='/vacations' element={<Vacations />} />
          <Route exact path='/data' element={<MergedTable />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Initial;
