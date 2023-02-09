import React, { FC, useEffect, useState } from 'react';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { IProfileProps } from './profile.types';
import { Form, Formik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { showToastNotification } from '../../common/state/toast-notification/toast-notification.actions';

import * as Yup from 'yup';
import classNames from 'classnames';
import ConfirmModal from '../../common/components/confirm-modal/confirm-modal';
import { UsersService } from '../../services/users.service';
import { auth } from '../../firebase-config';
import { IUser } from '../auth/login/login.types';
import { convertDateToBackendFormat } from '../../common/helpers/ui.helper';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { UserRoles } from '../../common/constants/common.constants';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IPatientRecord } from '../patients/add-record/add-record.types';

const AddNewSchema = Yup.object().shape({
  firstName: Yup.string().trim().required('mandatory_field'),
  lastName: Yup.string().trim().required('mandatory_field'),
  email: Yup.string().trim().required('mandatory_field').email('invalid_email'),
  birthday: Yup.string().required('mandatory_field'),
  phoneNumber: Yup.string().required('mandatory_field'),
});

const Profile: FC<IProfileProps> = ({ ...props }) => {
  const [formValues, setFormValues] = useState<any>();
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [doctors, setDoctors] = useState<IUser[]>();

  const loggedUser = auth.currentUser;
  const usersService = new UsersService();

  useEffect(() => {
    usersService.getUser(loggedUser?.uid as string).then(response => setUser(response));
    usersService.getAllUsers().then(
      usersResponse => {
        setDoctors(usersResponse.filter(user => user.role === UserRoles.DOCTOR));
      },
      err => console.log(err)
    );
  }, []);

  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        birthday: new Date(user.birthday as string),
        doctor: user.doctor,
      });
    }
  }, [user]);

  const cardFooter = (submitForm: () => void): JSX.Element => {
    return (
      <div className="text-right">
        <Button label={props.translate('save')} className="p-button-success primary-button" icon="pi pi-check" onClick={submitForm} />
        <Button
          label={props.translate('cancel')}
          icon="pi pi-times"
          className="p-button-text tertiary-button"
          onClick={() => (window.location.href = '/dashboard')}
        />
      </div>
    );
  };

  const onSubmit = (values: IUser, { setSubmitting }: any): void => {
    const valueToSubmit = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values?.email,
      phoneNumber: values?.phoneNumber,
      birthday: convertDateToBackendFormat(values.birthday as Date),
      doctor: values.doctor,
    };

    usersService.updateUser(valueToSubmit, user?.id as string).then(
      () => {
        setSubmitting(false);
        usersService.getUser(loggedUser?.uid as string).then(response => setUser(response));
        props.showToastNotification('success', 'Success', props.translate('profile_edited_successfully'));
      },
      () => {
        setSubmitting(false);
        props.showToastNotification('error', 'Error', props.translate('profile_edit_error'));
      }
    );
  };

  const imageTemplate = (rowData: IPatientRecord): JSX.Element => {
    return <img className="table-image" src={rowData.picture} alt="record-picture" />;
  };

  const confirmDialogContent: JSX.Element = <p className="stp-body-1">{props.translate('are_you_sure_change_password')}</p>;

  return (
    <>
      {user ? (
        <>
          <Formik
            enableReinitialize
            initialValues={{
              ...formValues,
            }}
            validationSchema={AddNewSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched, submitForm, values, setFieldValue }) => {
              return (
                <Form>
                  <div className="grid">
                    <div className={user.role === UserRoles.PATIENT ? 'col-12 lg:col-5' : 'col-12'}>
                      <Card className="profile-card" title={props.translate('general_information')} footer={() => cardFooter(submitForm)}>
                        <div className="grid flex align-items-center">
                          <div className="col-3">
                            <p className="stp-body-3">{props.translate('first_name')}</p>
                          </div>
                          <div className="col-9">
                            <InputText
                              required
                              autoFocus
                              name="firstName"
                              value={values.firstName || ''}
                              className={classNames('w-full', {
                                'p-invalid': errors.firstName && touched.firstName,
                              })}
                              onChange={e => {
                                setFieldValue('firstName', e.target.value);
                              }}
                              placeholder={props.translate('first_name')}
                            />
                            {errors.firstName && touched.firstName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                          </div>

                          <div className="col-3">
                            <p className="stp-body-3">{props.translate('last_name')}</p>
                          </div>
                          <div className="col-9">
                            <InputText
                              required
                              name="lastName"
                              value={values.lastName || ''}
                              className={classNames('w-full', {
                                'p-invalid': errors.lastName && touched.lastName,
                              })}
                              onChange={e => {
                                setFieldValue('lastName', e.target.value);
                              }}
                              placeholder={props.translate('last_name')}
                            />
                            {errors.lastName && touched.lastName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                          </div>

                          <div className="col-3">
                            <p className="stp-body-3">{props.translate('phone')}</p>
                          </div>
                          <div className="col-9">
                            <InputText
                              required
                              name="phone"
                              value={values.phoneNumber || ''}
                              className={classNames('w-full', {
                                'p-invalid': errors.phoneNumber && touched.phoneNumber,
                              })}
                              onChange={e => {
                                setFieldValue('phoneNumber', e.target.value);
                              }}
                              placeholder={props.translate('phone')}
                            />
                            {errors.phoneNumber && touched.phoneNumber && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                          </div>

                          <div className="col-3">
                            <p className="stp-body-3">{props.translate('birthday')}</p>
                          </div>
                          <div className="col-9">
                            <Calendar
                              id="birthday"
                              showIcon
                              monthNavigator
                              yearNavigator
                              dateFormat="dd/mm/yy"
                              selectionMode="single"
                              yearRange="1900:2030"
                              value={values.birthday as Date}
                              className={classNames('w-full', {
                                'p-invalid': errors.birthday && touched.birthday,
                              })}
                              placeholder={props.translate('select_date')}
                              onChange={e => {
                                setFieldValue('birthday', e.value);
                              }}
                            />
                            {errors.birthday && touched.birthday && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                          </div>

                          {user.role === UserRoles.PATIENT && (
                            <>
                              <div className="col-3">
                                <p className="stp-body-3">{props.translate('doctor')}</p>
                              </div>
                              <div className="col-9">
                                <Dropdown
                                  disabled
                                  options={doctors}
                                  optionLabel="displayName"
                                  optionValue="id"
                                  className="w-full"
                                  name="doctor"
                                  placeholder={props.translate('doctor')}
                                  value={values.doctor}
                                  onChange={e => setFieldValue('doctor', e.target.value)}
                                />
                                {errors.doctor && touched.doctor && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                              </div>
                            </>
                          )}

                          <div className="col-3">
                            <p className="stp-body-3">{props.translate('email')}</p>
                          </div>
                          <div className="col-9">
                            <InputText
                              disabled
                              required
                              name="email"
                              value={values.email || ''}
                              className={classNames('w-full', {
                                'p-invalid': errors.email && touched.email,
                              })}
                              onChange={e => {
                                setFieldValue('email', e.target.value);
                              }}
                              placeholder={props.translate('email')}
                            />
                            {errors.email && touched.email && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                          </div>
                        </div>
                      </Card>
                    </div>
                    {user.role === UserRoles.PATIENT && (
                      <div className="col-12 lg:col-7">
                        <Card className="profile-card" title={props.translate('med_book')}>
                          <DataTable
                            value={user.medBook}
                            showGridlines
                            dataKey="picture"
                            size="small"
                            selectionMode="single"
                            responsiveLayout="scroll"
                            emptyMessage={props.translate('no_items_found')}
                          >
                            <Column field="date" header={props.translate('date')} style={{ width: '20%' }} />
                            <Column field="description" header={props.translate('description')} style={{ width: '50%' }} />
                            <Column body={imageTemplate} field="picture" header={props.translate('picture')} style={{ width: '30%' }} />
                          </DataTable>
                        </Card>
                      </div>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>

          {showConfirmDialog && (
            <ConfirmModal visible={showConfirmDialog} hideDialog={() => setShowConfirmDialog(false)} content={confirmDialogContent} />
          )}
        </>
      ) : (
        <div className="whole-page-wrapper">
          <ProgressSpinner />
        </div>
      )}
    </>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(Profile));
