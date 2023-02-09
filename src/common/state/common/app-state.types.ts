import { IToastNotificationState } from '../../components/toast-notification/toast-notification.types';

export interface IAppState {
  toastNotification: IToastNotificationState;
  Intl: any;
}

export interface ICommonState {
  type?: string;
  message?: string;
  isSuccess?: boolean;
  isLoading?: boolean;
}
