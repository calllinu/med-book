import React, { FC } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { INavbarProps } from './navbar.types';
import { ISidebarItem } from '../../types/common.types';
import { IntlActions } from 'react-redux-multilingual';
import './navbar.scss';
import store from '../../state/common/store';
import { localStorageTypes } from '../../constants/localstorage.constants';
import { AuthService } from '../../../services/auth.service';

const Navbar: FC<INavbarProps> = ({ ...props }) => {
  const authService = new AuthService();
  const accountOptions: ISidebarItem[] = [
    {
      displayText: props.translate('profile'),
      link: '/profile',
    },
    {
      displayText: props.translate('logout'),
      onClick: () => {
        authService.logoutRequest();
      },
    },
  ];

  const languageOptions: ISidebarItem[] = [
    {
      displayText: props.translate('romanian'),
      onClick: () => changeLanguage('ro'),
    },
    {
      displayText: props.translate('english'),
      onClick: () => changeLanguage('en'),
    },
  ];

  const currentLanguage = store.getState().Intl.locale.toUpperCase();

  const changeLanguage = (lang: string): void => {
    store.dispatch(IntlActions.setLocale(lang));
    localStorage.setItem(localStorageTypes.LANGUAGE, lang);
  };

  return (
    <div className="navbar">
      {props.isMobile && (
        <div
          className={`navbar__menu--${props.mobileMenuActive ? 'expanded' : 'collapsed'}`}
          onClick={props.mobileMenuActive ? props.onMenuHide : props.onMenuClick}
        >
          <i className={`pi pi-${props.mobileMenuActive ? 'times' : 'bars'}`}></i>
        </div>
      )}
      <div className="navbar__content">
        <div className="topnav-content__items topnav-content__items--left"></div>
        <div className="navbar-content__items navbar-content__items--right">
          <ul>
            <li className="navbar-content__item navbar__account">
              <p className="stp-body-1 navbar-account__name">{currentLanguage === 'RO' ? props.translate('romanian') : props.translate('english')}</p>
              <i className="navbar-account__dropdown-icon pi pi-angle-down"></i>
              <div className="navbar-account__dropdown">
                <ul>
                  {languageOptions?.map(({ link, disabled, displayText, ...options }, index) => (
                    <Link
                      to={link || ''}
                      className={`${disabled ? 'navbar-account__item--disabled' : ''}`}
                      {...options}
                      key={`navbar-account__item--${index}`}
                    >
                      <li className="navbar-account__item">
                        <p className="navbar-account__item-name">{displayText}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </li>
            <li className="navbar-content__item navbar__account">
              <div className="navbar-picture-container mr-2"></div>
              <p className="stp-body-1 navbar-account__name">{props.accountName}</p>
              <i className="navbar-account__dropdown-icon pi pi-angle-down"></i>
              <div className="navbar-account__dropdown">
                <ul>
                  {accountOptions?.map(({ link, disabled, displayText, ...options }, index) => (
                    <Link
                      to={link || ''}
                      className={`${disabled ? 'navbar-account__item--disabled' : ''}`}
                      {...options}
                      key={`navbar-account__item--${index}`}
                    >
                      <li className="navbar-account__item">
                        <p className="navbar-account__item-name">{displayText}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withTranslate(Navbar);
