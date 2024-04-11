import React from 'react';
import { Input, Button, Form, Divider, Radio } from 'antd';
import { useRejoinFormHandlers } from '../../hooks/useRejoinForm';
import { useSocket } from '../../context/SocketContext';

export const RejoinForm = () => {

    const { game } = useSocket();

    const [form] = Form.useForm();

    const { handleJoinGameClick } = useRejoinFormHandlers(form);

    return (
        <div className="welcome-page">
            <div className="welcome-layout">
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
                    <Button
                        type="default"
                        onClick={handleJoinGameClick}
                        disabled={!game}>
                        Rejoin Game
                    </Button>
                </Form>
                <Divider type="vertical" className="divider" />
                {game && (
                    <div>
                        <h2>Current Game</h2>
                        <Radio checked value={game.id}>{game.game_name}</Radio>
                    </div>
                )}

            </div>
        </div>
    );
};
