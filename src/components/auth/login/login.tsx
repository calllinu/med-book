import React, { FC, useEffect, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { showToastNotification } from '../../../common/state/toast-notification/toast-notification.actions';
import { ILoginCredentials, ILoginProps, IUser } from './login.types';
import { InputText } from 'primereact/inputtext';
import { Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';

import * as Yup from 'yup';
import LoginPicture from '../../../assets/auth.png';
import { localStorageTypes } from './../../../common/constants/localstorage.constants';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../firebase-config';
import { AuthService } from '../../../services/auth.service';

const FormSchema = Yup.object().shape({
  email: Yup.string().email('invalid_email').required('mandatory_field'),
  password: Yup.string().trim().required('mandatory_field'),
});

const Login: FC<ILoginProps> = ({ ...props }) => {
  const [user, setUser] = useState<IUser>();
  const [remember, setRemember] = useState<boolean>();
  const [initialValues, setInitialValues] = useState<ILoginCredentials>();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cryptoJS = require('crypto-js');
  const authService = new AuthService();

  useEffect(() => {
    const savedAccount = JSON.parse(localStorage.getItem(localStorageTypes.SAVED_ACCOUNT) as string);
    if (savedAccount) {
      const bytes = cryptoJS.AES.decrypt(savedAccount.password, localStorageTypes.ENCRYPT_KEY);
      savedAccount.password = bytes.toString(cryptoJS.enc.Utf8);
      setInitialValues({ ...savedAccount });
      setRemember(true);
    } else {
      setInitialValues({ email: '', password: '' });
    }
  }, []);

  onAuthStateChanged(auth, currentUser => {
    setUser(currentUser as IUser);
  });

  const onUserLogin = (values: ILoginCredentials): void => {
    if (remember) {
      const valueToSave = {
        email: values.email,
        password: cryptoJS.AES.encrypt(values.password, localStorageTypes.ENCRYPT_KEY).toString(),
      };
      localStorage.setItem(localStorageTypes.SAVED_ACCOUNT, JSON.stringify(valueToSave));
    } else {
      localStorage.removeItem(localStorageTypes.SAVED_ACCOUNT);
    }

    authService.loginRequest(values.email, values.password, props.showToastNotification, props.translate);
  };

  if (user) return <Redirect to="/" />;

  return (
    <div className="whole-page-wrapper">
      <div className="grid">
        <div className="sm:col-12 lg:col-6 flex justify-content-center align-items-center">
          <img src={LoginPicture} style={{ width: '90%' }} alt=""></img>
        </div>
        <div className="sm:col-12 lg:col-5 sm:text-center lg:text-left">
          <p className="stp-header-1 text-bold m-0">{props.translate('welcome_back')}</p>
          <p className="stp-header-3 mt-2">{props.translate('login_instructions')}</p>

          {initialValues && (
            <Formik initialValues={initialValues} onSubmit={onUserLogin} validationSchema={FormSchema}>
              {({ setFieldValue, errors, touched, values }) => {
                return (
                  <Form>
                    <div className="mt-5 login-credentials">
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
                      <Button className="primary-button w-full" label={props.translate('login')} type="submit"></Button>
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

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(Login));
