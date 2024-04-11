import { GameProvider } from "../../context/GameContext";
import { Game } from "./Game";

export const GamePage = () => {
    return (
        <GameProvider>
            <Game />
        </GameProvider>
    );
}