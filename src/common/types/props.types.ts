import { ToastSeverityType } from 'primereact/toast';

export interface ICommonProps {
  translate: (key: string) => any;
  children?: unknown;
  showToastNotification: (severity: ToastSeverityType, summary: string, detail: string) => void;
}
