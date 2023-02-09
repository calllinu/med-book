import React, { FC, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { connect, RootStateOrAny } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { showToastNotification } from '../../../common/state/toast-notification/toast-notification.actions';
import { IEditPatientProps } from './edit-patient.types';
import { Dropdown } from 'primereact/dropdown';

import * as Yup from 'yup';
import classNames from 'classnames';
import { UsersService } from '../../../services/users.service';
import { Calendar } from 'primereact/calendar';
import { IUser } from '../../auth/login/login.types';
import { convertDateToBackendFormat } from '../../../common/helpers/ui.helper';
import { UserRoles } from '../../../common/constants/common.constants';

const EditPatient: FC<IEditPatientProps> = ({ ...props }) => {
  const [doctors, setDoctors] = useState<IUser[] | []>([]);

  const AddNewSchema = Yup.object().shape({
    firstName: Yup.string().required('mandatory_field'),
    lastName: Yup.string().required('mandatory_field'),
    birthday: Yup.string().required('mandatory_field'),
    phoneNumber: Yup.string().required('mandatory_field'),
    doctor: Yup.string().required('mandatory_field'),
    email: Yup.string().email('invalid_email').required('mandatory_field'),
  });

  const usersService = new UsersService();

  const formValues = {
    firstName: props.selectedPatient ? props.selectedPatient.firstName : undefined,
    lastName: props.selectedPatient ? props.selectedPatient.lastName : undefined,
    phoneNumber: props.selectedPatient ? props.selectedPatient.phoneNumber : undefined,
    birthday: props.selectedPatient ? new Date(props.selectedPatient.birthday as string) : undefined,
    email: props.selectedPatient ? props.selectedPatient.email : undefined,
    doctor: props.selectedPatient ? props.selectedPatient.doctor : undefined,
    role: props.selectedPatient ? props.selectedPatient.role : undefined,
  };

  useEffect(() => {
    usersService.getAllUsers().then(
      usersResponse => {
        setDoctors(usersResponse.filter(user => user.role === UserRoles.DOCTOR));
      },
      err => console.log(err)
    );
  }, []);

  const onSubmit = (values: IUser, { resetForm, setSubmitting }: any): void => {
    const valueToSubmit = {
      firstName: values.firstName,
      lastName: values.lastName,
      role: values.role,
      email: values.email,
      birthday: convertDateToBackendFormat(values.birthday as Date),
    };

    usersService.updateUser(valueToSubmit, props.selectedPatient.id as string).then(
      () => {
        props.showToastNotification('success', 'Success', props.translate('patient_edited_successfully'));
        if (props.loadData) {
          props.loadData();
        }
        resetForm();
        setSubmitting(false);
        props.hideDialog();
      },
      () => {
        props.showToastNotification('error', 'Error', props.translate('patient_edit_error'));
        setSubmitting(false);
      }
    );
  };

  const dialogFooter = (submitForm: () => void): JSX.Element => {
    return (
      <>
        <Button label={props.translate('save')} className="p-button-success primary-button" icon="pi pi-check" onClick={submitForm} />
        <Button label={props.translate('cancel')} icon="pi pi-times" className="p-button-text tertiary-button" onClick={() => props.hideDialog()} />
      </>
    );
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...formValues,
      }}
      validationSchema={AddNewSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, resetForm, submitForm, values, setFieldValue }) => {
        return (
          <Form>
            <Dialog
              modal
              visible={props.visible}
              header={props.translate('edit_patient')}
              className="p-fluid"
              footer={() => dialogFooter(submitForm)}
              onHide={() => {
                props.hideDialog();
                resetForm();
              }}
            >
              <div className="grid">
                <div className="col-12">
                  <div className="field">
                    <InputText
                      required
                      autoFocus
                      name="firstName"
                      value={values.firstName || ''}
                      className={classNames({
                        'p-invalid': errors.firstName && touched.firstName,
                      })}
                      onChange={e => {
                        setFieldValue('firstName', e.target.value);
                      }}
                      placeholder={props.translate('first_name')}
                    />
                    {errors.firstName && touched.firstName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <InputText
                      required
                      name="lastName"
                      value={values.lastName || ''}
                      className={classNames({
                        'p-invalid': errors.lastName && touched.lastName,
                      })}
                      onChange={e => {
                        setFieldValue('lastName', e.target.value);
                      }}
                      placeholder={props.translate('last_name')}
                    />
                    {errors.lastName && touched.lastName && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <InputText
                      required
                      name="lastName"
                      value={values.phoneNumber || ''}
                      className={classNames({
                        'p-invalid': errors.phoneNumber && touched.phoneNumber,
                      })}
                      onChange={e => {
                        setFieldValue('phoneNumber', e.target.value);
                      }}
                      placeholder={props.translate('phone')}
                    />
                    {errors.phoneNumber && touched.phoneNumber && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
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
                </div>

                <div className="col-12">
                  <div className="field">
                    <span className="p-input-icon-left w-full">
                      <i className="pi pi-users" />
                      <Dropdown
                        options={doctors}
                        optionLabel="displayName"
                        optionValue="id"
                        className="w-full"
                        name="doctor"
                        placeholder={props.translate('doctor')}
                        value={values.doctor}
                        onChange={e => setFieldValue('doctor', e.target.value)}
                      />
                    </span>
                    {errors.doctor && touched.doctor && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                  </div>
                </div>

                <div className="col-12">
                  <div className="field">
                    <InputText
                      required
                      disabled
                      name="email"
                      value={values.email || ''}
                      className={classNames({
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

                <div className="col-12">
                  <Dropdown
                    id="role"
                    name="role"
                    value={values.role}
                    options={props.roles}
                    onChange={e => {
                      setFieldValue('role', e.value);
                    }}
                    optionLabel="name"
                    optionValue="value"
                    className={classNames({
                      'p-invalid': errors.role && touched.role,
                    })}
                    placeholder={props.translate('role')}
                  ></Dropdown>
                  {errors.role && touched.role && <small className="p-invalid">{props.translate('mandatory_field')}</small>}
                </div>
              </div>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (): RootStateOrAny => ({});

const mapDispatchToProps = {
  showToastNotification: showToastNotification,
};

export default withTranslate(connect(mapStateToProps, mapDispatchToProps)(EditPatient));
