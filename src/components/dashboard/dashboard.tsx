import React, { FC } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { IDashboardProps } from './dashboard.types';
import { withTranslate } from 'react-redux-multilingual';

import LoginPicture from '../../assets/auth.png';

const Dashboard: FC<IDashboardProps> = () => {
  return (
    <div className="grid">
      <div className="col-12 flex justify-content-center align-items-center">
        <img src={LoginPicture} style={{ width: '100vh' }} alt=""></img>
      </div>
    </div>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

export default withTranslate(connect(mapStateToProps, {})(Dashboard));
