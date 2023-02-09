import { ToastSeverityType } from 'primereact/toast';
import { ICommonState } from '../../state/common/app-state.types';
import { ICommonProps } from '../../types/props.types';

export interface IToastNotification {
  severity?: ToastSeverityType;
  summary?: string;
  detail?: string;
  visible?: boolean;
}

export interface IToastNotificationProps extends ICommonProps, IToastNotification {
  resetToastNotification: () => void;
}

export interface IToastNotificationState extends ICommonState, IToastNotification {}
