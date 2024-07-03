import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from '../../components/SignUp/SignUp';
import SignIn from '../../components/SignIn/SignIn';
import SignOut from '../../components/SignOut/SignOut';
import Employees from '../../components/Employees';
import Vacations from '../../components/Vacations';
import MergedTable from '../../components/MergedTable/MergedTable';
import ImportFile from '../../components/ImportFile';
import Home from '../Home';
import { AuthProvider } from '../../context/AuthContext';
import PrivateRoute from '../../services/PrivateRoute';

function Initial() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signout" element={<SignOut />} />
          <Route path="/home" element={<Home />} />
          <Route element={<PrivateRoute />}>
            <Route path="/employees" element={<Employees />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/data" element={<MergedTable />} />
            <Route path="/import_file" element={<ImportFile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default Initial;
