import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Layout, Menu } from 'antd';
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import MainPage from './components/MainPage';
import TorrentPage from './components/TorrentPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import './app.global.css';

const { Header, Content, Footer } = Layout;
const appVersion = require('electron').remote.app.getVersion();

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Route render={({ location }) => (
          <Layout className="layout">
            <Header>
              <div className="logo" />
              <Menu
                theme="dark"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/search">Search</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/settings">Settings</Link></Menu.Item>
              </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
              <div style={{ background: '#fff', padding: 16, minHeight: 280 }}>
                <CSSTransitionGroup
                  transitionName="fade"
                  transitionEnterTimeout={300}
                  transitionLeaveTimeout={300}
                >
                  <Route location={location} key={location.key} exact path="/" component={MainPage} />
                  <Route location={location} key={location.key} path="/torrent/:id" component={TorrentPage} />
                  <Route location={location} key={location.key} path="/search/:query?" component={SearchPage} />
                  <Route location={location} key={location.key} path="/settings" component={SettingsPage} />
                </CSSTransitionGroup>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Version { appVersion }
            </Footer>
          </Layout>
        )}
        />
      </Router>
    );
  }
}
