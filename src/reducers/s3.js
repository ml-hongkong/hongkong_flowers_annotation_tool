import { handleAction, combineActions } from 'redux-actions';
import { s3Success, s3Failed, getFileList } from '../actions/s3Actions';

const defaultState = {
  results: [],
  errorMessage: '',
};

export default handleAction(combineActions(s3Success, s3Failed, getFileList), {
  next: (state, { payload }) => {
    return { ...state, ...payload };
  },
  throw: state => ({ ...state, ...defaultState }),
}, defaultState);
