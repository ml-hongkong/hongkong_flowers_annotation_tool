import HomePage from '../containers/HomePage';
import LoginPage from '../containers/LoginPage';
import LogoutPage from '../containers/LogoutPage';
import NotFoundPage from '../containers/NotFoundPage';

export default [
  {
    exact: true,
    path: '/',
    component: HomePage,
  },
  {
    path: '/login',
    component: LoginPage,
    nav: false,
  },
  {
    path: '/logout',
    component: LogoutPage,
    nav: false,
  },
  {
    component: NotFoundPage,
    name: '404',
    nav: false,
  }
];
