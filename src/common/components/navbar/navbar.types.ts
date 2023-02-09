import { ICommonProps } from '../../types/props.types';

export interface INavbarProps extends ICommonProps {
  isMobile?: boolean;
  mobileMenuActive?: boolean;
  accountName?: string;
  profilePicture?: string;
  onMenuHide: () => void;
  onMenuClick: () => void;
  logOut: () => Promise<void>;
}
