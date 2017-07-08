import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import { Layout, Menu } from 'antd';
import {
  HashRouter as Router,
  Route,
  Link,
  Switch
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
              <div style={{ background: '#fff', padding: 16, minHeight: 'calc(100vh - 64px - 66px)' }}>
                <CSSTransitionGroup
                  transitionName="fade"
                  transitionEnterTimeout={500}
                  transitionLeaveTimeout={750}
                  className="fade"
                >
                  <Route location={location} key={location.pathname}>
                    <Switch>
                      <Route exact path="/" component={MainPage} />
                      <Route path="/torrent/:id" component={TorrentPage} />
                      <Route path="/search/:query?" component={SearchPage} />
                      <Route path="/settings" component={SettingsPage} />
                    </Switch>
                  </Route>
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
