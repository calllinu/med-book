import { ICommonProps } from '../../common/types/props.types';
import { IUser } from '../auth/login/login.types';

export interface IPatientsProps extends ICommonProps {
  patients: IUser[];
  error: string;
}

export interface ILockingUser {
  lockUser?: boolean;
  unlockUser?: boolean;
}
