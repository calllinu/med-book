import { IntlReducer as Intl } from 'react-redux-multilingual';
import { combineReducers } from 'redux';
import toastNotification from '../toast-notification/toast-notification.reducers';

const reducers = combineReducers({
  toastNotification,
  Intl,
});

export default reducers;
