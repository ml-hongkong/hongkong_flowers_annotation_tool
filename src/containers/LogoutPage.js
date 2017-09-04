import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import { firebaseConnect } from 'react-redux-firebase';

@firebaseConnect()
@connect(
  () => ({}),
  dispatch => ({
    routerActions: bindActionCreators(routerActions, dispatch),
  }),
)
class LogoutPage extends React.Component {
  static propTypes = {
    firebase: PropTypes.shape({
      logout: PropTypes.func.isRequired,
      auth: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      replace: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillMount () {
    this.props.firebase.logout().then(() => {
      this.setState({ called: true }, () => {
        // this.props.appActions.setNotification('success', 'Logged Out.');
        this.props.routerActions.replace('/');
      });
    }).catch((err) => {
      this.setState({ called: true }, () => {
        // this.props.appActions.setNotification('error', err.message);
        this.props.routerActions.replace('/');
      });
    });
  }

  render () {
    return null;
  }
}

export default LogoutPage;
