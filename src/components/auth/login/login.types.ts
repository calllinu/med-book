import { ICommonProps } from '../../../common/types/props.types';
import { IPatientRecord } from '../../patients/add-record/add-record.types';

export interface ILoginProps extends ICommonProps {}

export interface ILoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface IUserCredentials {
  accessToken: string;
  user: string;
  expiry: number;
  tokenType: string;
  uid: string;
}

export interface IUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  medBook?: IPatientRecord[];
  role?: string;
  doctor?: string;
  birthday?: string | Date;
  password?: string;
  phoneNumber?: string;
  displayName?: string;
}

export interface IRole {
  name?: string;
  value?: string;
}
