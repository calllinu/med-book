import { IUser } from '../../../components/auth/login/login.types';
import { ICommonProps } from '../../types/props.types';

export interface ISidebarProps extends ICommonProps {
  className?: string;
  currentUser?: IUser;
}
