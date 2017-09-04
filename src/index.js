import React from 'react';
import { AppContainer as ReactHotWrapper } from 'react-hot-loader';
import createHistory from 'history/createBrowserHistory';
import ReactDOM from 'react-dom';
import App from './components/App';
import RedBox from 'redbox-react';
import configureStore from './store/configureStore';

// -----------------------------------------------------------------------------
// init
// -----------------------------------------------------------------------------

// fix touch|tap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Browser ES6 Polyfill
import 'babel-polyfill';

window.React = React;

// import styles
require('./styles/app.sass');

const history = createHistory();
const store = configureStore({}, history);

// -----------------------------------------------------------------------------
// render
// -----------------------------------------------------------------------------
function withReactHotLoader (RootElement) {
  const root = document.getElementById('app');
  const node = (
    <ReactHotWrapper>
      <RootElement history={ history } store={ store } />
    </ReactHotWrapper>
  );

  if (window.__DEBUG__) {
    try {
      ReactDOM.render(node, root);
    } catch (ex) {
      ReactDOM.render(<RedBox error={ ex } />, root);
    }
  } else {
    ReactDOM.render(node, root);
  }
}

withReactHotLoader(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const rootEl = require('./components/App').default;
    withReactHotLoader(rootEl);
  });
}
