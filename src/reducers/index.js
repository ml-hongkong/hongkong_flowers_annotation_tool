import s3 from './s3';
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';

export default combineReducers({
  routing,
  s3,
});
