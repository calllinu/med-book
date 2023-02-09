import { ICommonProps } from '../../../common/types/props.types';
import { IUser } from '../../auth/login/login.types';
import { IRole } from '../../auth/login/login.types';

export interface IEditPatientProps extends ICommonProps {
  selectedPatient: IUser;
  visible: boolean;
  doctors: IUser[];
  roles: IRole[];
  hideDialog: () => void;
  loadData: () => void;
}
