import { ICommonProps } from '../../../common/types/props.types';
import { IUser } from '../../auth/login/login.types';

export interface IViewPatientProps extends ICommonProps {
  selectedPatient: IUser;
  visible: boolean;
  hideDialog: () => void;
}
