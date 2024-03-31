import React, { FC, createContext, useEffect, useState } from 'react';
import axios from 'axios';

const SimpleAuthContext = createContext({
    isAuthenticated: false,
    login: (token: string) => { },
    logout: () => { }
});

const handleAxiosDefaults = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

export const SimpleAuthProvider: FC = (props: React.PropsWithChildren) => {
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

    return (
        <SimpleAuthContext.Provider value={{
            isAuthenticated: !!token,
            login: (token: string) => {
                setToken(token);
                login(token);
            },
            logout: () => {
                setToken(null);
                logout();
            }
        }}>
            {props.children}
        </SimpleAuthContext.Provider>
    );


};