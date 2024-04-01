import React from 'react';
import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Login } from './Pages/Login';
import { UserRouteProtected } from './Components/RouterWrappers/UserRouteProtected';
import axios from 'axios';
import { SimpleAuthProvider } from './Providers/SimpleAuthProvider';
import { View } from './Pages/View';
import { Upload } from './Pages/Upload';

const guestRoutes = [
  {
    path: '/login',
    element: <Login />,
  },
];

const userRoutes = [
  {
    path: '/',
    element: <UserRouteProtected />,
    children: [
      {
        path: '/csv',
        element: <Upload />,
      },
      {
        path: '/',
        element: <View />,
      }
    ]
  },
];

const router = createBrowserRouter([
  ...guestRoutes,
  ...userRoutes
]);

axios.defaults.baseURL = 'http://localhost:3000'; // defaults here

function App() {
  return (
    <SimpleAuthProvider>
      <div className="App">
        <header className="App-header">
          CSV upload demo app.
        </header>
        <RouterProvider router={router} />
      </div>
    </SimpleAuthProvider>
  );
}

export default App;
