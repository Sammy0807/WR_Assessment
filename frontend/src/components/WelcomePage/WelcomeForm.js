import React from 'react';
import { Input, Button, Form } from 'antd';
import { useFormHandlers } from '../../hooks/useFormHandlers';
import { useWelcome } from '../../context/WelcomeContext';
import { useNavigate } from 'react-router-dom'; 

export const WelcomeForm = () => {
    const {
        selectedGame,
        showGameNameInput,
        handleCreateGameClick,
        handleRankingGameClick
    } = useWelcome();

    const [form] = Form.useForm();  

    const { handleStartNewGameClick, handleJoinGameClick } = useFormHandlers(form);

    return (
        <Form
            form={form}
            layout="vertical"
            className="welcome-form"
        >
            <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input placeholder="Your Name" />
            </Form.Item>
            {showGameNameInput && (
                <Form.Item
                    name="gameName"
                    rules={[{ required: true, message: 'Please input the game name!' }]}
                >
                    <Input placeholder="Game Name" />
                </Form.Item>
            )}
            <div className='button-group'>
                <Button
                    type="default"
                    onClick={handleJoinGameClick}
                    disabled={!selectedGame}>
                    Join Game
                </Button>
                <Button
                    type="primary"
                    onClick={handleRankingGameClick}>
                    Ranking
                </Button>
                {showGameNameInput ? (
                    <Button
                        type="primary"
                        onClick={handleStartNewGameClick}>
                        Start New Game
                    </Button>

                ) : (
                    <Button
                        type="primary"
                        onClick={handleCreateGameClick}>
                        Create Game
                    </Button>
                )}
            </div>
        </Form>
    );
};
