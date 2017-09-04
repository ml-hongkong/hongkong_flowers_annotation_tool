import React from 'react';
import { Layout } from 'antd';
import AppHeader from '../AppHeader';
import AppFooter from '../AppFooter';
import PropTypes from 'prop-types';
const { Content } = Layout;

const AppLayout = ({ children, profile }) => (
  <Layout>
    <AppHeader profile={profile}/>
    <Layout style={{ padding: '24px' }}>
      <Content className="App-content">
        { children }
      </Content>
    </Layout>
    <AppFooter />
  </Layout>
);

AppLayout.propTypes = {
  children: PropTypes.element,
  profile: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default AppLayout;
