import React, { FC } from 'react';
import { useAuthContext } from '../../Providers/SimpleAuthProvider';
import { Navigate, NavLink, Outlet, redirect, Route } from 'react-router-dom';

export type UserRouteProtectedProps = {
    children?: React.ReactNode;
};

export const UserRouteProtected: FC<UserRouteProtectedProps> = (props) => {
    const { isAuthenticated, logout } = useAuthContext();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <h2> User area </h2> <button onClick={logout}>Logout</button> <br />

            <NavLink to="/">View CSV</NavLink>
            <br />
            <NavLink to="/csv">Upload CSV</NavLink>

            <hr />

            <Outlet />
        </>
    );
}