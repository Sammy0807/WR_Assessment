import { router } from "../App";
import { useApp } from "../context/AppContext";


export const useApi = () => { 
    const { messageApi } = useApp()
    const baseUrl = 'http://localhost:4100/api';

    const getGames = async () => {
        try {
            const response = await fetch(`${baseUrl}/games`);
            if (!response.ok) {
                const text = await response.json();
                throw new Error(text.message);
            }
            const data = await response.json();
            return data
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message ?? "Error Fetching Games",
            });
        }
    }

    const getGameById = async (gameId) => {
        try {
            const response = await fetch(`${baseUrl}/games/${gameId}`);
            if (!response.ok) {
                const text = await response.json();
                throw new Error(text.message);
            }
            const data = await response.json();
            return data;

        } catch (error) {
            router.navigate("/");
            messageApi.open({
                type: 'error',
                content: error.message ?? "Error Fetching Game",
            });
        }
    }

    const getRankings = async () => {
        try {
            const response = await fetch(`${baseUrl}/rankings`);
            if (!response.ok) {
                const text = await response.json();
                throw new Error(text.message);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message ?? "Error Fetching Rankings",
            });
        }
    }

    const createGame = async (gameName, playerName) => {
        try {
            const response = await fetch(`${baseUrl}/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gameName, playerName })
            });
            if (!response.ok) {
                const text = await response.json();
                throw new Error(text.message);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: error.message ?? "Error Creating Game",
            });
        }
    }

    return { getGames, getGameById, getRankings, createGame };
}
