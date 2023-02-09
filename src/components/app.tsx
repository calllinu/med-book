import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/app.scss';

import React, { FC, useEffect, useState } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { IAppProps } from './app.types';
import { isDesktop } from '../common/constants/common.constants';
import classNames from 'classnames';
import Sidebar from '../common/components/sidebar/sidebar';
import Navbar from '../common/components/navbar/navbar';
import { IUser } from './auth/login/login.types';
import { auth } from '../firebase-config';
import { UsersService } from './../services/users.service';

const App: FC<IAppProps> = ({ ...props }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState<boolean>(false);
  const [mobileMenuClicked, setMobileMenuClicked] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<IUser>();

  const usersService = new UsersService();

  useEffect(() => {
    const loggedUser = auth.currentUser;
    usersService.getUser(loggedUser?.uid as string).then(response => setCurrentUser(response));
  }, []);

  const getIsDesktop = (): boolean => isDesktop(window.innerWidth);
  let isMounted: boolean;

  const useIsDesktop = (): boolean => {
    const [isDesktop, setIsDesktop] = useState(getIsDesktop());

    useEffect(() => {
      isMounted = true;
      const onResize = (): void => {
        if (isMounted) {
          setIsDesktop(getIsDesktop());
          setMobileMenuActive(false);
        }
      };

      if (!isDesktop) setMobileMenuActive(false);
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    }, []);

    return isDesktop;
  };

  const sidebarClassName = classNames({
    'sidebar--hidden': !useIsDesktop() && !mobileMenuActive,
    'sidebar--opening': mobileMenuActive && mobileMenuClicked,
  });

  return (
    <div>
      <Sidebar className={sidebarClassName} currentUser={currentUser}></Sidebar>
      <Navbar
        isMobile={!useIsDesktop()}
        mobileMenuActive={mobileMenuActive}
        onMenuClick={() => {
          setMobileMenuActive(true);
          setMobileMenuClicked(true);
        }}
        onMenuHide={() => {
          setMobileMenuActive(false);
          setMobileMenuClicked(true);
        }}
        accountName={currentUser?.displayName}
      />
      <div className={`layout-content layout-content--${useIsDesktop() ? 'desktop' : 'mobile'}`}>
        <div className={`container container--${useIsDesktop() ? 'desktop' : 'mobile'}`}>{props.children}</div>
      </div>
    </div>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(App));
