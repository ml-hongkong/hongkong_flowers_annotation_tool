import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import routes from '../routes';
import { Route, Switch } from 'react-router-dom';

export default class App extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
  }

  render () {
    return (
      <Provider store={ this.props.store }>
        <ConnectedRouter history={ this.props.history }>
          <section className="App">
            <Route render={({ location, history, match }) => (
              <Switch>
                { routes.map((route, i) => (
                  <Route key={i} {...route}/>
                )) }
              </Switch>
            )} />
          </section>
        </ConnectedRouter>
      </Provider>
    );
  }
}
