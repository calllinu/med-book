import { ICommonProps } from '../../types/props.types';

export interface IConfirmModalProps extends ICommonProps {
  visible: boolean;
  content: JSX.Element;
  hideDialog: () => void;
  confirm: () => void;
}
