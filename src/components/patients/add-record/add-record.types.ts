import { ICommonProps } from '../../../common/types/props.types';
import { IUser } from '../../auth/login/login.types';

export interface IAddRecordProps extends ICommonProps {
  selectedPatient: IUser;
  visible: boolean;
  hideDialog: () => void;
  loadData: () => void;
}

export interface IPatientRecord {
  date?: string | Date;
  description?: string;
  picture?: string;
  displayName?: string;
}
