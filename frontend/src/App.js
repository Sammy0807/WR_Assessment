// src/App.js
import React from 'react';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import {WelcomePage} from './components/WelcomePage/WelcomePage';
import {Rankings} from './components/Rankings/Rankings';
import { AppProvider } from './context/AppContext';
import { SocketProvider } from './context/SocketContext';
import { GamePage } from './components/GamePage/GamePage';
import { RejoinPage } from './components/RejoinPage/RejoinPage';

export const router = createBrowserRouter([
  { path: '/', element: <WelcomePage /> },,
  { path: '/game/:id', element: <GamePage /> },
  { path: '/rejoin/:id', element: <RejoinPage /> },
  { path: '/rankings', element: <Rankings /> },
  { path: '*', element: <Navigate to="/" /> },
]);

function App() {
  return (
    <AppProvider>
      <SocketProvider>
      <RouterProvider router={router}>
        <div className="App" />
      </RouterProvider>
      </SocketProvider>
    </AppProvider>
  );
}

export default App;
