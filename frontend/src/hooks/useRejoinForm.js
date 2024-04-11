import { router } from '../App';
import { useApp } from '../context/AppContext';
import { useSocket } from '../context/SocketContext';

export const useRejoinFormHandlers = (form) => {
    const { setPlayerName, messageApi } = useApp();
    const { rejoinGame, game } = useSocket();

    const handleJoinGameClick = () => {
        form.validateFields(['name'])
            .then(values => {
                let showError = false;
                if (game.status === "in_progress") {
                    if (game.x_player !== values.name && game.o_player !== values.name) {
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
                rejoinGame(game.id, values.name);
                router.navigate(`/game/${game.id}`);
            })
            .catch(info => {
                // Form validation failed
                console.log('Validate Failed:', info);
            });
    }

    return { handleJoinGameClick };
}