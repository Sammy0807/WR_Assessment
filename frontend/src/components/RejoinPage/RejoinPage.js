import { GameProvider } from "../../context/GameContext";
import { RejoinForm } from "./RejoinForm";

export const RejoinPage = () => {
    return (
        <GameProvider>
            <RejoinForm />
        </GameProvider>
    );
}