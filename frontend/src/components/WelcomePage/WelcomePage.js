import React from 'react';
import { WelcomeForm } from './WelcomeForm';
import { Divider } from 'antd';
import { GamesList } from './GamesList';
import { WelcomeProvider } from '../../context/WelcomeContext';

export const WelcomePage = () => {
  return (
    <WelcomeProvider>
      <div className="welcome-page">
      <div className="welcome-layout">
        <WelcomeForm />
        <Divider type="vertical" className="divider" />
        <GamesList />
      </div>
    </div>
    </WelcomeProvider>
  );
};
