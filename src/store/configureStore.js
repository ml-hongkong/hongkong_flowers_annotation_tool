import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import rootReducer from '../reducers';
import { reactReduxFirebase, getFirebase, firebaseStateReducer } from 'react-redux-firebase';

const NODE_ENV = process.env.NODE_ENV || 'development';
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};
const configureStore = (initialState, history) => {
  const reducers = combineReducers({
    initialState,
    rootReducer,
    firebase: firebaseStateReducer,
    routing: routerReducer,
  });

  const middlewares = [
    thunk.withExtraArgument(getFirebase), // Pass getFirebase function as extra argument
    routerMiddleware(history),
  ];

  if (NODE_ENV === 'development') {
    const { createLogger } = require('redux-logger');
    const logger = createLogger({ collapsed: true });
    middlewares.push(logger);
  }

  const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      }) : compose;

  return createStore(
    reducers,
    composeEnhancers(
      applyMiddleware(...middlewares),
      reactReduxFirebase(firebaseConfig, { userProfile: 'users', enableLogging: false })
    )
  );
};

export default configureStore;
