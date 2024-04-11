import { List, Radio } from 'antd';
import { useWelcome } from '../../context/WelcomeContext';

export const GamesList = () => {
    const { handleSelectedGame, games, selectedGame } = useWelcome();
    return (
        <div>
          <h2>Existing Games</h2>
          <Radio.Group
            className="game-list"
            onChange={handleSelectedGame}
            value={selectedGame}
          >
            <List
              dataSource={games}
              renderItem={item => (
                <List.Item>
                  <Radio value={item}>{item.game_name}</Radio>
                  <p>player: {item.x_player}</p>
                  </List.Item>
              )}
            />
          </Radio.Group>
        </div>
    );
}