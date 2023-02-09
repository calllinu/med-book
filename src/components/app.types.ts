import { ICommonProps } from '../common/types/props.types';
import { IUser } from './auth/login/login.types';

export interface IAppProps extends ICommonProps {
  currentUser?: IUser;
}
