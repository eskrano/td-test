import React, { FC, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../Providers/SimpleAuthProvider';
import { Navigate, redirect } from 'react-router-dom';

export const Login: FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loginResult, setLoginResult] = useState<'loading' | 'success' | 'error' | null>(null);

    const { login, isAuthenticated } = useAuthContext();

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const responseLogin = await axios.post('/auth', {
            username,
            password
        });

        if (responseLogin.status === 200) {
            const jsonResponse = responseLogin.data;

            login(jsonResponse.token);
            setLoginResult('success');

            return redirect('/csv');
        } else {
            setLoginResult('error');

            return false;
        }
    };

    return (
        <div>


            <h1>Login</h1>

            {loginResult === 'success' && <p>Login successful!</p>}
            {loginResult === 'error' && <p>Login failed!</p>}
            {loginResult === 'loading' && <p>Loading...</p>}

            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    );

}