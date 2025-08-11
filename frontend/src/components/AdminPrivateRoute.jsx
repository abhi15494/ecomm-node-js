import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPrivateRoute = () => {
  const { userInfo } = useSelector(state => state.auth);

  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace={true} />;
}

export default AdminPrivateRoute
