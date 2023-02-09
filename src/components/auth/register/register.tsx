import React, { FC, useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { showToastNotification } from '../../../common/state/toast-notification/toast-notification.actions';
import { InputText } from 'primereact/inputtext';
import { Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

import * as Yup from 'yup';
import LoginPicture from '../../../assets/auth.png';
import { localStorageTypes } from '../../../common/constants/localstorage.constants';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import { AuthService } from '../../../services/auth.service';
import { IRegisterProps } from './register.types';
import { IUser } from '../login/login.types';
import { UsersService } from '../../../services/users.service';
import { convertDateToBackendFormat } from './../../../common/helpers/ui.helper';
import { Calendar } from 'primereact/calendar';
import { UserRoles } from '../../../common/constants/common.constants';
import { Dropdown } from 'primereact/dropdown';

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required('mandatory_field'),
  lastName: Yup.string().required('mandatory_field'),
  birthday: Yup.string().required('mandatory_field'),
  phoneNumber: Yup.string().required('mandatory_field'),
  doctor: Yup.string().required('mandatory_field'),
  email: Yup.string().email('invalid_email').required('mandatory_field'),
  password: Yup.string().trim().required('mandatory_field'),
});

const Register: FC<IRegisterProps> = ({ ...props }) => {
  const [user, setUser] = useState<IUser>();
  const [doctors, setDoctors] = useState<IUser[] | []>([]);
  const [remember, setRemember] = useState<boolean>();
  const [initialValues, setInitialValues] = useState<IUser>();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cryptoJS = require('crypto-js');
  const authService = new AuthService();
  const usersService = new UsersService();

  useEffect(() => {
    usersService.getAllUsers().then(
      usersResponse => {
        setDoctors(usersResponse.filter(user => user.role === UserRoles.DOCTOR));
      },
      err => console.log(err)
    );
    setInitialValues({ firstName: '', lastName: '', phoneNumber: '', email: '', password: '' });
  }, []);

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser as IUser);
  });

  const onUserRegister = (values: IUser): void => {
    if (remember) {
      const valueToSave = {
        email: values.email,
        password: cryptoJS.AES.encrypt(values.password, localStorageTypes.ENCRYPT_KEY).toString(),
      };
      localStorage.setItem(localStorageTypes.SAVED_ACCOUNT, JSON.stringify(valueToSave));
    } else {
      localStorage.removeItem(localStorageTypes.SAVED_ACCOUNT);
    }

    authService.registerRequest(values.email as string, values.password as string).then(response => {
      usersService.addUser(
        {
          id: response.user.uid,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          birthday: convertDateToBackendFormat(values.birthday as Date),
          role: UserRoles.PATIENT,
          doctor: values.doctor,
          displayName: `${values.lastName} ${values.firstName}`,
        },
        response.user.uid
      );
    });
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="whole-page-wrapper">
      <div className="grid">
        <div className="sm:col-12 lg:col-6 flex justify-content-center align-items-center">
          <img src={LoginPicture} style={{ width: '90%' }} alt=""></img>
        </div>
        <div className="sm:col-12 lg:col-5 sm:text-center lg:text-left">
          <p className="stp-header-1 text-bold m-0">{props.translate('welcome')}</p>
          <p className="stp-header-3 mt-2">{props.translate('register_instructions')}</p>

          {initialValues && (
            <Formik initialValues={initialValues} onSubmit={onUserRegister} validationSchema={FormSchema}>
              {({ setFieldValue, errors, touched, values }) => {
                return (
                  <Form>
                    <div className="mt-5 login-credentials">
                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-user-edit" />
                          <InputText
                            className="w-full"
                            name="firstName"
                            placeholder={props.translate('first_name')}
                            value={values.firstName}
                            onChange={e => setFieldValue('firstName', e.target.value)}
                          />
                        </span>
                        {errors.firstName && touched.firstName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-user-edit" />
                          <InputText
                            className="w-full"
                            name="lastName"
                            placeholder={props.translate('last_name')}
                            value={values.lastName}
                            onChange={e => setFieldValue('lastName', e.target.value)}
                          />
                        </span>
                        {errors.lastName && touched.lastName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-phone" />
                          <InputText
                            className="w-full"
                            name="phoneNumber"
                            placeholder={props.translate('phone')}
                            value={values.phoneNumber}
                            onChange={e => setFieldValue('phoneNumber', e.target.value)}
                          />
                        </span>
                        {errors.phoneNumber && touched.phoneNumber && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-phone" />
                          <Calendar
                            id="birthday"
                            monthNavigator
                            yearNavigator
                            dateFormat="dd/mm/yy"
                            selectionMode="single"
                            yearRange="1900:2030"
                            value={values.birthday as Date}
                            className="w-full no-border"
                            placeholder={props.translate('birthday')}
                            onChange={e => {
                              setFieldValue('birthday', e.value);
                            }}
                          />
                        </span>
                        {errors.birthday && touched.birthday && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-users" />
                          <Dropdown
                            options={doctors}
                            optionLabel="displayName"
                            optionValue="id"
                            className="w-full no-border"
                            name="doctor"
                            placeholder={props.translate('doctor')}
                            value={values.doctor}
                            onChange={e => setFieldValue('doctor', e.target.value)}
                          />
                        </span>
                        {errors.doctor && touched.doctor && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-envelope" />
                          <InputText
                            className="w-full"
                            name="email"
                            placeholder={props.translate('email')}
                            value={values.email}
                            onChange={e => setFieldValue('email', e.target.value)}
                          />
                        </span>
                        {errors.email && touched.email && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                      </div>

                      <div className="field">
                        <span className="p-input-icon-left w-full">
                          <i className="pi pi-lock" />
                          <InputText
                            className="w-full"
                            type="password"
                            name="password"
                            value={values.password}
                            placeholder={props.translate('password')}
                            onChange={e => setFieldValue('password', e.target.value)}
                          />
                          {errors.password && touched.password && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-content-between align-items-center mt-2">
                      <div className="p-field-checkbox">
                        <Checkbox inputId="remember" checked={remember} onChange={e => setRemember(e.checked)} />
                        <label htmlFor="remember">{props.translate('remember_me')}</label>
                      </div>
                      <NavLink to="/register">
                        <p className="link-text">{props.translate('not_have_account') + '?'}</p>
                      </NavLink>
                    </div>

                    <div className="mt-5 w-full">
                      <Button className="primary-button w-full" label={props.translate('register')} type="submit"></Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(Register));
