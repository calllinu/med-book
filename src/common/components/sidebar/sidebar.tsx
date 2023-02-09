import React, { FC, useEffect, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { useHistory, useLocation } from 'react-router';
import { ISidebarItem } from '../../types/common.types';
import { ISidebarProps } from './sidebar.types';
import AppLogo from '../../../assets/logo.png';
import './sidebar.scss';
import { UserRoles } from '../../constants/common.constants';

const Sidebar: FC<ISidebarProps> = ({ ...props }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  const navigateTo = (link: string): void => {
    history.push(link);
  };

  const menuItems: ISidebarItem[] = [
    {
      active: activeMenu?.includes('/dashboard'),
      iconName: 'home',
      displayText: props.translate('dashboard'),
      link: '/dashboard',
      onClick: () => navigateTo('/dashboard'),
    },
    {
      active: activeMenu?.includes('/history'),
      iconName: 'calendar',
      displayText: props.translate('history'),
      link: '/history',
      onClick: () => navigateTo('/history'),
    },
    {
      disabled: props.currentUser?.role === UserRoles.PATIENT,
      active: activeMenu?.includes('/patients'),
      iconName: 'users',
      displayText: props.translate('patients'),
      link: '/patients',
      onClick: () => navigateTo('/patients'),
    },
  ];

  return (
    <div className={`sidebar ${props.className}`}>
      <div className="sidebar__logo">
        <img src={AppLogo} alt="" />
      </div>
      <div className="sidebar__content">
        <ul className="sidebar-content__items">
          {menuItems
            .filter(menu => !menu.disabled)
            ?.map((item, index) => (
              <li
                className={`sidebar-content__item ${item.active ? 'sidebar-content__item--active' : ''}`}
                key={`sidebar--${index}`}
                onClick={item.onClick}
              >
                <div className="sidebar-content__item-box">
                  <i className={`sidebar-content__item-icon pi pi-${item.iconName}`}></i>
                  <p className="sidebar-content__item-name">{item.displayText}</p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default withTranslate(Sidebar);
