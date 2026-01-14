import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    );
};

const PrivateRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>; // Or a spinner
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (user && user.role === 'admin') ? <Outlet /> : <Navigate to="/" replace />;
};

export { Layout, PrivateRoute, AdminRoute };
