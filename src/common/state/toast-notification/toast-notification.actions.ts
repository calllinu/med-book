import { ToastSeverityType } from 'primereact/toast';
import { IToastNotificationState } from '../../components/toast-notification/toast-notification.types';

export enum ToastNotificationActions {
  SHOW_TOAST_NOTIFICATION = 'SHOW_TOAST_NOTIFICATION',
  RESET_TOAST_NOTIFICATION = 'RESET_TOAST_NOTIFICATION',
}

export const showToastNotification = (severity: ToastSeverityType, summary: string, detail: string): IToastNotificationState | any => {
  return {
    type: ToastNotificationActions.SHOW_TOAST_NOTIFICATION,
    severity,
    summary,
    detail,
  };
};

export const resetToastNotification = (): IToastNotificationState => {
  return {
    type: ToastNotificationActions.RESET_TOAST_NOTIFICATION,
  };
};
