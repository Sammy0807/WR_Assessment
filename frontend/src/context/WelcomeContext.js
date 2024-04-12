import React, { createContext, useContext, useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi'; 
import { router } from '../App';

export const WelcomeContext = createContext();

export const useWelcome = () => useContext(WelcomeContext);

export const WelcomeProvider = ({ children }) => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [showGameNameInput, setShowGameNameInput] = useState(false);
    const [games, setGames] = useState([]);

    const { getGames } = useApi();

    useEffect(() => {
        getGames().then((data) => {
            if (data?.games) {
                setGames(data.games)
            }
        }
        )
    }, [])


    useEffect(() => {
        if (selectedGame) {
            setShowGameNameInput(false)
        }
    }, [selectedGame])

    const handleCreateGameClick = () => {
        setShowGameNameInput(true);
        setSelectedGame(null);
    };
    const handleRankingGameClick = () => {
        router.navigate(`rankings`)
    }

    const handleSelectedGame = (e) => setSelectedGame(e.target.value)

    return (
        <WelcomeContext.Provider value={{
            games, setGames, selectedGame, setSelectedGame, showGameNameInput, setShowGameNameInput,
            handleCreateGameClick, handleRankingGameClick, handleSelectedGame
        }}>
            {children}
        </WelcomeContext.Provider>
    );
};
