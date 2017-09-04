import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Alert } from 'antd';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';
import { userIsNotAuthenticated } from '../lib/auth';

@firebaseConnect() // adds this.props.firebase
@connect(
  // Map state to props
  ({ firebase }) => ({
    authError: pathToJS(firebase, 'authError'),
  })
)
@userIsNotAuthenticated // redirects to '/' if user is logged in
export default class Login extends Component {
  static propTypes = {
    firebase: PropTypes.shape({
      login: PropTypes.func.isRequired
    }),
    authError: PropTypes.shape({
      message: PropTypes.string // eslint-disable-line react/no-unused-prop-types
    })
  };

  googleLogin = () => {
    this.props.firebase.login({ provider: 'google', type: 'popup' });
  }

  render () {
    const { authError } = this.props;
    const errorMessage = authError && authError.hasOwnProperty('message') ?
      (<Alert message={ authError.message } type="error" />) :
      null;

    return (
      <div className="Login">
        <h1 className="Login-title">Hong Kong Flower Identification APP</h1>
        <h3 className="Login-subtitle">Annotation Tool</h3>
        <Button
          className="Login-button"
          icon="login"
          onClick={ this.googleLogin }
          size="large"
          type="primary">Login with Google</Button>
        { errorMessage }
        <footer className="Login-footer">Copyright 2017 Hong Kong Deep Learning</footer>
      </div>
    );
  }
}
