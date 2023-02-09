import React, { FC, useEffect, useRef, useState } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { connect, RootStateOrAny } from 'react-redux';
import { Card } from 'primereact/card';
import { showToastNotification } from '../../common/state/toast-notification/toast-notification.actions';
import { UsersService } from '../../services/users.service';
import { auth } from '../../firebase-config';
import { IHistoryProps } from './history.types';
import { IPatientRecord } from '../patients/add-record/add-record.types';
import { Timeline } from 'primereact/timeline';
import { convertDateToFrontendFormat } from '../../common/helpers/ui.helper';
import { IUser } from '../auth/login/login.types';
import { UserRoles } from '../../common/constants/common.constants';

const History: FC<IHistoryProps> = ({ ...props }) => {
  const [history, setHistory] = useState<IPatientRecord[] | []>([]);

  const isCancelled = useRef(false);
  const usersService = new UsersService();

  useEffect(() => {
    isCancelled.current = false;
    const loggedUser = auth.currentUser;
    usersService.getUser(loggedUser?.uid as string).then(response => loadLazyData(response));
    return () => {
      isCancelled.current = true;
    };
  }, []);

  const loadLazyData = (currentUser: IUser): void => {
    if (currentUser.role === UserRoles.DOCTOR) {
      usersService.getAllUsers().then(
        usersResponse => {
          const totalVisits: IPatientRecord[] = [];
          const patients = usersResponse.filter(patient => patient.doctor === auth.currentUser?.uid);
          patients.forEach(patient =>
            totalVisits.push(
              ...(patient.medBook as IPatientRecord[]).map(record => {
                return { ...record, displayName: patient.displayName };
              })
            )
          );
          setHistory(totalVisits);
        },
        err => console.log(err)
      );
    } else {
      setHistory(currentUser.medBook as IPatientRecord[]);
    }
  };

  const customizedMarker = (): JSX.Element => {
    return (
      <span
        className="custom-marker flex justify-content-center align-items-center"
        style={{ backgroundColor: '#003852', width: '30px', height: '30px', borderRadius: '50%' }}
      >
        <i className="pi pi-check-circle" style={{ color: '#fff' }}></i>
      </span>
    );
  };

  const customizedContent = (item: IPatientRecord): JSX.Element => {
    return (
      <Card title={item.displayName} subTitle={convertDateToFrontendFormat(item.date)}>
        {item.picture && <img src={item.picture} alt={item.displayName} width={200} className="p-shadow-2" />}
        <p>{item.description}</p>
      </Card>
    );
  };

  return (
    <>
      <Card>
        <div className="grid mb-2">
          <div className="col-12 px-0">
            <p className="stp-header-2"> {props.translate('patients')}</p>
            <Timeline value={history} align="alternate" className="customized-timeline" marker={customizedMarker} content={customizedContent} />
          </div>
        </div>
      </Card>
    </>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(History));
