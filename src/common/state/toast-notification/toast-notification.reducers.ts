import { IToastNotificationState } from '../../components/toast-notification/toast-notification.types';
import { ToastNotificationActions } from './toast-notification.actions';

const initialState: IToastNotificationState = {
  severity: 'error',
  summary: '',
  detail: '',
  visible: false,
};

const toastNotification = (state = initialState, action: IToastNotificationState): IToastNotificationState => {
  switch (action.type) {
    case ToastNotificationActions.SHOW_TOAST_NOTIFICATION:
      return {
        ...state,
        severity: action.severity,
        summary: action.summary,
        detail: action.detail,
        visible: true,
      };

    case ToastNotificationActions.RESET_TOAST_NOTIFICATION:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default toastNotification;
