import { router } from '../App';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';
import { useWelcome } from '../context/WelcomeContext';
import { useApi } from "./useApi";

export const useFormHandlers = (form) => {
    const { selectedGame } = useWelcome();
    const { setPlayerName, messageApi } = useApp();
    const { joinGame } = useSocket();
    const { createGame } = useApi();

    const handleStartNewGameClick = () => {
        form.validateFields(['name', 'gameName'])
            .then(values => {
                setPlayerName(values.name);
                createGame(values.gameName, values.name).then((data) => {
                    if (data?.gameId) {
                        router.navigate(`game/${data.gameId}`)
                    }
                })
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    }

    const handleJoinGameClick = () => {
        form.validateFields(['name'])
            .then(values => {
                let showError = false;
                if (selectedGame.status === "in_progress") {
                    if (selectedGame.x_player !== values.name && selectedGame.o_player !== values.name) {
                        showError = true
                    }
                }

                if (selectedGame.status === "pending") {
                    if (selectedGame.x_player === values.name) {
                        showError = true
                    }
                }

                if (showError) {
                    messageApi.open({
                        type: 'error',
                        content: "Unable to join game, youre not a participant",
                    });
                    return;
                }

                setPlayerName(values.name);
                joinGame(selectedGame.id, values.name);
                router.navigate(`/game/${selectedGame.id}`);
            })
            .catch(info => {
                // Form validation failed
                console.log('Validate Failed:', info);
            });
    }

    return { handleStartNewGameClick, handleJoinGameClick };
}