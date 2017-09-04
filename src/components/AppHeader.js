import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Layout, Menu, Row, Col, Dropdown, Icon } from 'antd';

const { Header } = Layout;

const AppHeader = ({ profile }) => {
  const profileMenu = (
    <Menu>
      <Menu.Item>
        <a href="/logout" rel="noopener noreferrer">Logout</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="App-header">
      <Row>
        <Col span={12}>
          <h1 className="App-header-logo">Hong Kong Flower APP</h1>
          <Menu
            className="App-header-meun"
            defaultSelectedKeys={['1']}
            mode="horizontal"
            theme="dark"
          >
            <Menu.Item key="1">Home</Menu.Item>
          </Menu>
        </Col>
        <Col className="App-header-aux" span={12}>
          <Dropdown overlay={profileMenu} placement="bottomRight">
            <a className="ant-dropdown-link">
              <Avatar className="App-header-avatar" src={profile.avatarUrl} />
              { profile.displayName } <Icon type="down"/>
            </a>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

AppHeader.propTypes = {
  profile: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default AppHeader;
