import React, { useState } from 'react';
import { Table, Row, Col } from 'antd';

const UserInfo = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  // Dummy data for the users table
  const usersData = [
    {
      key: '1',
      stt: '1',
      name: 'John Doe',
      description: 'User description here',
    },
    // ... more users
  ];

  // Dummy data for the commands list
  const commandsData = selectedUser ? [
    {
      key: '1',
      command: 'Command 1 for selected user',
    },
    // ... more commands
  ] : [];

  const userColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const commandsColumns = [
    {
      title: 'Commands',
      dataIndex: 'command',
      key: 'command',
    },
  ];

  console.log("show log user")

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Table
          columns={userColumns}
          dataSource={usersData}
          onRow={(record) => {
            return {
              onClick: () => {
                setSelectedUser(record);
              }, // click row to select user
            };
          }}
        />
      </Col>
      <Col span={16}>
        {selectedUser && (
          <Table
            columns={commandsColumns}
            dataSource={commandsData}
            pagination={false}
          />
        )}
      </Col>
    </Row>
  );
};

export default UserInfo;
