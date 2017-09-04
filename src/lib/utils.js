import { connectedReduxRedirect } from 'redux-auth-wrapper/history3/redirect';
import { replace } from 'react-router-redux';
import { pathToJS } from 'react-redux-firebase';
import LoadingComponent from '../components/Loading';

export const userIsAuthenticated = connectedReduxRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  AuthenticatingComponent: LoadingComponent,
  redirectPath: '/login',
  authenticatedSelector: ({ firebase }) => {
    const profile = pathToJS(firebase, 'profile');

    return typeof profile !== 'undefined' &&
      pathToJS(firebase, 'profile') !== null &&
      profile.isAdmin;
  },
  authenticatingSelector: ({ firebase }) =>
    pathToJS(firebase, 'profile') === undefined || pathToJS(firebase, 'isInitializing') === true,
  redirectAction: newLoc => dispatch => {
    dispatch(replace(newLoc));
    dispatch({
      type: 'UNAUTHED_REDIRECT',
      payload: { message: 'You must be authenticated.' },
    });
  },
});

export const userIsNotAuthenticated = connectedReduxRedirect({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  AuthenticatingComponent: LoadingComponent,
  allowRedirectBack: false,
  authenticatedSelector: ({ firebase }) => {
    const profile = pathToJS(firebase, 'profile');
    return !(profile && profile.isAdmin) &&
      pathToJS(firebase, 'isInitializing') === false;
  },
  redirectPath: '/',
  redirectAction: newLoc => dispatch => {
    dispatch(replace(newLoc));
    dispatch({
      type: 'AUTHED_REDIRECT',
      payload: { message: 'User is authenticated. Redirecting home...' }
    });
  }
});
