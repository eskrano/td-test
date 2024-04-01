import React, { FC, createContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';

const SimpleAuthContext = createContext({
    isAuthenticated: false,
    login: (token: string) => { },
    logout: () => { }
});

export const useAuthContext = () => React.useContext(SimpleAuthContext);

const handleAxiosDefaults = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    logout();
                    alert('Session expired, please login again');
                    window.location.reload();

                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

const login = (token: string) => {
    localStorage.setItem('token', token);
};

const logout = () => {
    localStorage.removeItem('token');
};

export const SimpleAuthProvider: FC<{ children: React.ReactElement }> = (props) => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
        } else {
            setToken(null);
        }
    }, []);

    useEffect(() => {
        handleAxiosDefaults(token);
    }, [token]);

    const providerValue = useMemo(() => ({
        isAuthenticated: !!token,
        login: (token: string) => {
            setToken(token);
            login(token);
        },
        logout: () => {
            setToken(null);
            logout();
        }
    }), [token]);

    return (
        <SimpleAuthContext.Provider value={providerValue}>
            {props.children}
        </SimpleAuthContext.Provider>
    );


};