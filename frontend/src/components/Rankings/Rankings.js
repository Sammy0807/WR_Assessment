import React from 'react';
import { Table ,Button} from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { UseRankings } from '../../hooks/useRankings';
import { router } from '../../App';

export const Rankings = () => {
    const { rankings } = UseRankings();

    const handleBack = () => {
        router.navigate(`/`)
    }

    const columns = [
        {
            title: 'Player',
            dataIndex: 'player',
            key: 'player',
        },
        {
            title: 'Wins',
            dataIndex: 'wins',
            key: 'wins',
            defaultSortOrder: 'descend',
            sorter: (a, b) => b.wins < a.wins,
        },
    ];

    return (
        <div className="rankings">
            <h2>Rankings</h2>
            <Table columns={columns} dataSource={rankings.map((r, index) => ({ ...r, key: index }))} />
            <Button onClick={handleBack} type="primary" shape="round" icon={<LeftOutlined />} size={30}>
            Back
          </Button>
        </div>
    );
};

