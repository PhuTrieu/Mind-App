import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    if (!localStorage.getItem('accessToken')) {
        return <Navigate to="/login"/>;
    }
    return (
        <Outlet />
    )
}
