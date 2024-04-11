import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd'

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [playerName, setPlayerName] = useState('');

    return (
        <AppContext.Provider value={{
            messageApi,
            playerName,
            setPlayerName,
        }}>
            {contextHolder}
            {children}
        </AppContext.Provider>
    );
};
